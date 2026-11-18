# 🌱 El Jardín de los Recuerdos

> Planta un recuerdo y míralo florecer.

Sitio web donde guardas tus recuerdos y los ves crecer como flores digitales. Cada emoción tiene su propia flor:

| Emoción   | Flor |
|-----------|------|
| Alegría   | 🌻   |
| Amor      | 🌹   |
| Nostalgia | 🌷   |
| Tristeza  | 🥀   |
| Calma     | 🪻   |

🔗 **Demo en vivo:** [jardin-de-recuerdos-gules.vercel.app](https://jardin-de-recuerdos-gules.vercel.app/)

## ✨ Funcionalidades

- 🌱 **Plantar** recuerdos con título, texto, fecha y emoción
- 🌼 **Ver** el jardín, ordenado del recuerdo más reciente al más antiguo
- ✏️ **Editar** y 🗑️ **eliminar** recuerdos
- 🔎 **Filtrar** por emoción
- 💾 Los datos **persisten** al recargar la página
- 📱 Diseño **responsive** (móvil y escritorio)
- 🌻 Incluye recuerdos de ejemplo la primera vez que se abre

## 🛠️ Tecnologías

- [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- SQLite en el navegador con [sql.js](https://github.com/sql-js/sql.js), guardado en `localStorage`
- Arquitectura MVC (`db`, `models`, `views`, `controllers`)
- Desplegado en [Vercel](https://vercel.com/)

## 🗄️ Base de datos

Tabla `recuerdos`:

| Campo   | Tipo                     | Descripción                                   |
|---------|--------------------------|-----------------------------------------------|
| id      | INTEGER (clave primaria) | Identificador autoincremental                 |
| titulo  | TEXT                     | Título del recuerdo                           |
| texto   | TEXT                     | Descripción del recuerdo                      |
| fecha   | TEXT                     | Fecha del recuerdo (`AAAA-MM-DD`)             |
| emocion | TEXT                     | `alegria`, `amor`, `nostalgia`, `tristeza` o `calma` |

> **Nota:** la base de datos corre en el navegador y se guarda en `localStorage`, por lo que cada visitante tiene su propio jardín.

## 📁 Estructura del proyecto

```
src/
├── main.ts
├── db/
│   └── database.ts        # Conexión SQLite (sql.js) y persistencia
├── models/
│   └── recuerdo.ts        # CRUD de recuerdos
├── views/
│   └── jardinView.ts      # Interfaz (formulario y flores)
├── controllers/
│   └── jardinController.ts # Coordina vista y modelo
└── styles/
    └── styles.css
```

## 🚀 Cómo ejecutarlo

```bash
git clone https://github.com/AnderOrtiz/jardin-de-recuerdos.git
cd jardin-de-recuerdos
npm install
npm run dev
```

Para generar la versión de producción:

```bash
npm run build
npm run preview
```

## 👤 Autor

**Anderson Ortiz** · [GitHub](https://github.com/AnderOrtiz)