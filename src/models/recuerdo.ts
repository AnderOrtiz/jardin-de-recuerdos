import { getDB, guardar } from "../db/database";

export type Emocion = "alegria" | "amor" | "nostalgia" | "tristeza" | "calma";

export interface Recuerdo {
    id: number;
    titulo: string;
    texto: string;
    fecha: string;
    emocion: Emocion;
    foto: string | null;
}

export type NuevoRecuerdo = Omit<Recuerdo, "id">;

function filasARecuerdos(res: { columns: string[]; values: unknown[][] }[]): Recuerdo[] {
    if (res.length === 0) return [];
    const { columns, values } = res[0];
    return values.map((fila) => {
        const obj: Record<string, unknown> = {};
        columns.forEach((c, i) => (obj[c] = fila[i]));
        return obj as unknown as Recuerdo;
    });
}

// CREATE: devuelve false si no hubo espacio para guardar (y deshace el cambio)
export function crearRecuerdo(r: NuevoRecuerdo): boolean {
    const db = getDB();
    db.run(
        "INSERT INTO recuerdos (titulo, texto, fecha, emocion, foto) VALUES (?, ?, ?, ?, ?)",
        [r.titulo, r.texto, r.fecha, r.emocion, r.foto]
    );
    if (guardar()) return true;
    db.run("DELETE FROM recuerdos WHERE id = last_insert_rowid()");
    return false;
}

// READ
export function listarRecuerdos(emocion?: Emocion | ""): Recuerdo[] {
    const sql = emocion
        ? "SELECT * FROM recuerdos WHERE emocion = ? ORDER BY fecha DESC"
        : "SELECT * FROM recuerdos ORDER BY fecha DESC";
    const res = getDB().exec(sql, emocion ? [emocion] : []);
    return filasARecuerdos(res);
}

export function obtenerRecuerdo(id: number): Recuerdo | undefined {
    const res = getDB().exec("SELECT * FROM recuerdos WHERE id = ?", [id]);
    return filasARecuerdos(res)[0];
}

// UPDATE: devuelve false si no hubo espacio (y restaura la versión anterior)
export function actualizarRecuerdo(id: number, r: NuevoRecuerdo): boolean {
    const db = getDB();
    const antes = obtenerRecuerdo(id);
    const sql = "UPDATE recuerdos SET titulo = ?, texto = ?, fecha = ?, emocion = ?, foto = ? WHERE id = ?";
    db.run(sql, [r.titulo, r.texto, r.fecha, r.emocion, r.foto, id]);
    if (guardar()) return true;
    if (antes) db.run(sql, [antes.titulo, antes.texto, antes.fecha, antes.emocion, antes.foto, id]);
    return false;
}

// DELETE
export function eliminarRecuerdo(id: number): void {
    getDB().run("DELETE FROM recuerdos WHERE id = ?", [id]);
    guardar();
}