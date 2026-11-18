import {
    crearRecuerdo, listarRecuerdos, obtenerRecuerdo,
    actualizarRecuerdo, eliminarRecuerdo, type Emocion,
} from "../models/recuerdo";
import { montarVista, pintarJardin, llenarFormulario, limpiarFormulario } from "../views/jardinView";

let editandoId: number | null = null;

function refrescar(): void {
    const filtro = (document.querySelector("#filtro-emocion") as HTMLSelectElement).value as Emocion | "";
    pintarJardin(listarRecuerdos(filtro));
}

export function iniciar(): void {
    montarVista(document.querySelector<HTMLElement>("#app")!);
    limpiarFormulario();
    refrescar();

    document.querySelector("#form-recuerdo")!.addEventListener("submit", (e) => {
        e.preventDefault();
        const datos = {
            titulo: (document.querySelector("#campo-titulo") as HTMLInputElement).value.trim(),
            texto: (document.querySelector("#campo-texto") as HTMLTextAreaElement).value.trim(),
            fecha: (document.querySelector("#campo-fecha") as HTMLInputElement).value,
            emocion: (document.querySelector("#campo-emocion") as HTMLSelectElement).value as Emocion,
        };
        if (!datos.titulo) return;

        if (editandoId === null) crearRecuerdo(datos);
        else actualizarRecuerdo(editandoId, datos);

        editandoId = null;
        limpiarFormulario();
        refrescar();
    });

    document.querySelector("#btn-cancelar")!.addEventListener("click", () => {
        editandoId = null;
        limpiarFormulario();
    });

    document.querySelector("#filtro-emocion")!.addEventListener("change", refrescar);

    document.querySelector("#jardin")!.addEventListener("click", (e) => {
        const boton = (e.target as HTMLElement).closest<HTMLButtonElement>("button[data-accion]");
        if (!boton) return;
        const id = Number(boton.closest<HTMLElement>(".flor")!.dataset.id);

        if (boton.dataset.accion === "editar") {
            const r = obtenerRecuerdo(id);
            if (!r) return;
            editandoId = id;
            llenarFormulario(r);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (boton.dataset.accion === "eliminar") {
            if (confirm("¿Arrancar esta flor del jardín?")) {
                eliminarRecuerdo(id);
                if (editandoId === id) {
                    editandoId = null;
                    limpiarFormulario();
                }
                refrescar();
            }
        }
    });
}