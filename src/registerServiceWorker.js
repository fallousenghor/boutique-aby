export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then(registration => {
          console.log('✓ Service Worker enregistré:', registration);
          
          // Vérifier les mises à jour
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Une nouvelle version est disponible
                console.log('💾 Nouvelle version disponible');
              }
            });
          });
        })
        .catch(error => {
          console.error('✗ Erreur lors de l\'enregistrement du Service Worker:', error);
        });
    });
  } else {
    console.warn('Service Worker non supporté par ce navigateur');
  }
}
