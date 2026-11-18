import { getDB, guardar } from "../db/database";

export type Emocion = "alegria" | "amor" | "nostalgia" | "tristeza" | "calma";

export interface Recuerdo {
    id: number;
    titulo: string;
    texto: string;
    fecha: string;
    emocion: Emocion;
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

// CREATE
export function crearRecuerdo(r: NuevoRecuerdo): void {
    getDB().run(
        "INSERT INTO recuerdos (titulo, texto, fecha, emocion) VALUES (?, ?, ?, ?)",
        [r.titulo, r.texto, r.fecha, r.emocion]
    );
    guardar();
}

// READ (con filtro opcional por emoción y orden por fecha)
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

// UPDATE
export function actualizarRecuerdo(id: number, r: NuevoRecuerdo): void {
    getDB().run(
        "UPDATE recuerdos SET titulo = ?, texto = ?, fecha = ?, emocion = ? WHERE id = ?",
        [r.titulo, r.texto, r.fecha, r.emocion, id]
    );
    guardar();
}

// DELETE
export function eliminarRecuerdo(id: number): void {
    getDB().run("DELETE FROM recuerdos WHERE id = ?", [id]);
    guardar();
}