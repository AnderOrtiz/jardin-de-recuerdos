import type { Emocion, Recuerdo } from "../models/recuerdo";

export const FLORES: Record<Emocion, { emoji: string; nombre: string }> = {
    alegria: { emoji: "🌻", nombre: "Alegría" },
    amor: { emoji: "🌹", nombre: "Amor" },
    nostalgia: { emoji: "🌷", nombre: "Nostalgia" },
    tristeza: { emoji: "🥀", nombre: "Tristeza" },
    calma: { emoji: "🪻", nombre: "Calma" },
};

function esc(s: string): string {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

const opciones = (Object.keys(FLORES) as Emocion[])
    .map((k) => `<option value="${k}">${FLORES[k].emoji} ${FLORES[k].nombre}</option>`)
    .join("");

export function montarVista(raiz: HTMLElement): void {
    raiz.innerHTML = `
    <header class="cabecera">
      <h1>🌱 El Jardín de los Recuerdos</h1>
      <p>Planta un recuerdo y míralo florecer.</p>
    </header>

    <main class="contenido">
      <section class="panel">
        <h2 id="form-titulo">Plantar un recuerdo</h2>
        <form id="form-recuerdo">
          <label>Título
            <input id="campo-titulo" required maxlength="60" placeholder="Ej: Mi primer viaje" />
          </label>
          <label>Lo que recuerdo
            <textarea id="campo-texto" rows="3" maxlength="300" placeholder="Cuéntalo con tus palabras..."></textarea>
          </label>
          <label>Fecha
            <input id="campo-fecha" type="date" required />
          </label>
          <label>Emoción
            <select id="campo-emocion">${opciones}</select>
          </label>
          <div class="botones">
            <button type="submit" id="btn-guardar" class="primario">Plantar 🌱</button>
            <button type="button" id="btn-cancelar" class="secundario" hidden>Cancelar</button>
          </div>
        </form>
      </section>

      <section class="jardin-seccion">
        <div class="filtro">
          <label for="filtro-emocion">Filtrar por emoción</label>
          <select id="filtro-emocion">
            <option value="">Todas</option>
            ${opciones}
          </select>
        </div>
        <div id="jardin" class="jardin"></div>
      </section>
    </main>
  `;
}

export function pintarJardin(recuerdos: Recuerdo[]): void {
    const cont = document.querySelector<HTMLElement>("#jardin")!;
    if (recuerdos.length === 0) {
        cont.innerHTML = `<p class="vacio">El jardín está vacío. ¡Planta tu primer recuerdo!</p>`;
        return;
    }
    cont.innerHTML = recuerdos
        .map((r) => {
            const f = FLORES[r.emocion];
            return `
        <article class="flor emocion-${r.emocion}" data-id="${r.id}">
          <div class="emoji" aria-hidden="true">${f.emoji}</div>
          <h3>${esc(r.titulo)}</h3>
          <time>${esc(r.fecha)} · ${f.nombre}</time>
          <p>${esc(r.texto ?? "")}</p>
          <div class="acciones">
            <button data-accion="editar" class="secundario">Editar</button>
            <button data-accion="eliminar" class="peligro">Eliminar</button>
          </div>
        </article>`;
        })
        .join("");
}

export function llenarFormulario(r: Recuerdo): void {
    (document.querySelector("#campo-titulo") as HTMLInputElement).value = r.titulo;
    (document.querySelector("#campo-texto") as HTMLTextAreaElement).value = r.texto ?? "";
    (document.querySelector("#campo-fecha") as HTMLInputElement).value = r.fecha;
    (document.querySelector("#campo-emocion") as HTMLSelectElement).value = r.emocion;
    document.querySelector("#form-titulo")!.textContent = "Editar recuerdo";
    document.querySelector("#btn-guardar")!.textContent = "Guardar cambios";
    document.querySelector<HTMLElement>("#btn-cancelar")!.hidden = false;
}

export function limpiarFormulario(): void {
    (document.querySelector("#form-recuerdo") as HTMLFormElement).reset();
    (document.querySelector("#campo-fecha") as HTMLInputElement).value =
        new Date().toISOString().slice(0, 10);
    document.querySelector("#form-titulo")!.textContent = "Plantar un recuerdo";
    document.querySelector("#btn-guardar")!.textContent = "Plantar 🌱";
    document.querySelector<HTMLElement>("#btn-cancelar")!.hidden = true;
}