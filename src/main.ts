import { initDB } from "./db/database";
import {
  crearRecuerdo, listarRecuerdos, actualizarRecuerdo, eliminarRecuerdo,
} from "./models/recuerdo";

initDB().then(() => {
  crearRecuerdo({ titulo: "Prueba", texto: "Hola", fecha: "2025-01-01", emocion: "amor" });
  console.log("Después de crear:", listarRecuerdos());

  const ultimo = listarRecuerdos().find((r) => r.titulo === "Prueba")!;
  actualizarRecuerdo(ultimo.id, { ...ultimo, titulo: "Prueba editada" });
  console.log("Después de editar:", listarRecuerdos("amor"));

  eliminarRecuerdo(ultimo.id);
  console.log("Después de eliminar:", listarRecuerdos());
});