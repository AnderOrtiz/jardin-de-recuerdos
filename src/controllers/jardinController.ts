import {
    crearRecuerdo, listarRecuerdos, obtenerRecuerdo,
    actualizarRecuerdo, eliminarRecuerdo, type Emocion,
} from "../models/recuerdo";
import {
    montarVista, pintarJardin, llenarFormulario, limpiarFormulario, mostrarPreview, abrirVisor,
} from "../views/jardinView";
import { comprimirImagen } from "../utils/imagen";

let editandoId: number | null = null;
let fotoActual: string | null = null;

function refrescar(): void {
    const filtro = (document.querySelector("#filtro-emocion") as HTMLSelectElement).value as Emocion | "";
    pintarJardin(listarRecuerdos(filtro));
}

function resetearFormulario(): void {
    editandoId = null;
    fotoActual = null;
    limpiarFormulario();
}

export function iniciar(): void {
    montarVista(document.querySelector<HTMLElement>("#app")!);
    resetearFormulario();
    refrescar();

    const inputFoto = document.querySelector("#campo-foto") as HTMLInputElement;

    inputFoto.addEventListener("change", async () => {
        const archivo = inputFoto.files?.[0];
        if (!archivo) return;
        try {
            fotoActual = await comprimirImagen(archivo);
            mostrarPreview(fotoActual);
        } catch {
            alert("No se pudo cargar esa imagen. Prueba con otra.");
            inputFoto.value = "";
        }
    });

    document.querySelector("#btn-quitar-foto")!.addEventListener("click", () => {
        fotoActual = null;
        inputFoto.value = "";
        mostrarPreview(null);
    });

    document.querySelector("#form-recuerdo")!.addEventListener("submit", (e) => {
        e.preventDefault();
        const datos = {
            titulo: (document.querySelector("#campo-titulo") as HTMLInputElement).value.trim(),
            texto: (document.querySelector("#campo-texto") as HTMLTextAreaElement).value.trim(),
            fecha: (document.querySelector("#campo-fecha") as HTMLInputElement).value,
            emocion: (document.querySelector("#campo-emocion") as HTMLSelectElement).value as Emocion,
            foto: fotoActual,
        };
        if (!datos.titulo) return;

        const ok = editandoId === null ? crearRecuerdo(datos) : actualizarRecuerdo(editandoId, datos);
        if (!ok) {
            alert("No hay espacio suficiente en el navegador para guardar esto. Quita la foto o elimina algún recuerdo con foto.");
            return;
        }

        resetearFormulario();
        refrescar();
    });

    document.querySelector("#btn-cancelar")!.addEventListener("click", resetearFormulario);
    document.querySelector("#filtro-emocion")!.addEventListener("change", refrescar);


    const visor = document.querySelector<HTMLDialogElement>("#visor")!;
    document.querySelector("#visor-cerrar")!.addEventListener("click", () => visor.close());
    visor.addEventListener("click", (e) => {
        if (e.target === visor) visor.close(); // clic fuera de la imagen
    });

    document.querySelector("#jardin")!.addEventListener("click", (e) => {
        const boton = (e.target as HTMLElement).closest<HTMLButtonElement>("button[data-accion]");
        if (!boton) return;
        const id = Number(boton.closest<HTMLElement>(".flor")!.dataset.id);

        if (boton.dataset.accion === "editar") {
            const r = obtenerRecuerdo(id);
            if (!r) return;
            editandoId = id;
            fotoActual = r.foto;
            llenarFormulario(r);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (boton.dataset.accion === "eliminar") {
            if (confirm("¿Arrancar esta flor del jardín?")) {
                eliminarRecuerdo(id);
                if (editandoId === id) resetearFormulario();
                refrescar();
            }
        } else if (boton.dataset.accion === "ampliar") {
            const r = obtenerRecuerdo(id);
            if (r?.foto) abrirVisor(r.foto, r.titulo);
        }
    });
}