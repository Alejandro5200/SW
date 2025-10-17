// Verificar si el navegador soporta Service Workers
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() { // ✅ Esperar a que la página cargue
        navigator.serviceWorker
            .register("./sw.js")
            .then((reg) => {
                console.log("✅ Service Worker registrado correctamente. Alcance:", reg.scope);
                
                // Verificar después de un momento
                setTimeout(() => {
                    if (navigator.serviceWorker.controller) {
                        console.log(" SW controlando la página");
                    } else {
                        console.log(" SW aún no controla la página");
                    }
                }, 1000);
            })
            .catch((err) => {
                console.error(" Error al registrar el Service Worker:", err);
            });
    });
} else {
    console.warn("⚠️ Este navegador no soporta Service Workers.");
}