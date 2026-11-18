export function comprimirImagen(archivo: File, maxLado = 480, calidad = 0.7): Promise<string> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(archivo);
        const img = new Image();

        img.onload = () => {
            const escala = Math.min(1, maxLado / Math.max(img.width, img.height));
            const canvas = document.createElement("canvas");
            canvas.width = Math.round(img.width * escala);
            canvas.height = Math.round(img.height * escala);
            const ctx = canvas.getContext("2d");
            URL.revokeObjectURL(url);
            if (!ctx) {
                reject(new Error("Canvas no disponible"));
                return;
            }
            ctx.fillStyle = "#fff"; // evita fondo negro en PNG con transparencia
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/jpeg", calidad));
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("No se pudo leer la imagen"));
        };

        img.src = url;
    });
}
