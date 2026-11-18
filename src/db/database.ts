import initSqlJs, { type Database } from "sql.js";
import wasmUrl from "sql.js/dist/sql-wasm.wasm?url";

const KEY = "jardin-db";
let db: Database;

function aBase64(bytes: Uint8Array): string {
    let s = "";
    bytes.forEach((b) => (s += String.fromCharCode(b)));
    return btoa(s);
}

function deBase64(b64: string): Uint8Array {
    return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

export async function initDB(): Promise<Database> {
    const SQL = await initSqlJs({ locateFile: () => wasmUrl });
    const guardada = localStorage.getItem(KEY);

    if (guardada) {
        db = new SQL.Database(deBase64(guardada));
    } else {
        db = new SQL.Database();
        db.run(`CREATE TABLE recuerdos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      texto TEXT,
      fecha TEXT NOT NULL,
      emocion TEXT NOT NULL,
      foto TEXT
    )`);
        db.run(
            `INSERT INTO recuerdos (titulo, texto, fecha, emocion) VALUES
      ('Mi primer día de universidad', 'Llegué nervioso y conocí a gente genial.', '2024-02-10', 'alegria'),
      ('El verano en casa de la abuela', 'El olor del pan recién hecho.', '2019-07-15', 'nostalgia'),
      ('Un atardecer en la playa', 'Nadie hablaba y no hacía falta.', '2023-12-30', 'calma')`
        );
        guardar();
    }
    migrar()
    return db;
}

function migrar(): void {
    const cols = db.exec("PRAGMA table_info(recuerdos)");
    const nombres = cols[0]?.values.map((f) => f[1]) ?? [];
    if (!nombres.includes("foto")) {
        db.run("ALTER TABLE recuerdos ADD COLUMN foto TEXT");
        guardar();
    }
}

export function getDB(): Database {
    return db;
}

export function guardar(): boolean {
    try {
        localStorage.setItem(KEY, aBase64(db.export()));
        return true;
    } catch {
        return false;
    }
}
