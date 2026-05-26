// Instalación básica del Service Worker
self.addEventListener('install', (e) => {
    console.log('Service Worker: Instalado');
});

self.addEventListener('activate', (e) => {
    console.log('Service Worker: Activado');
});
