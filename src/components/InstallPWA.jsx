import { useEffect, useState } from "react";
import { IconPlus } from "./icons";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    function onBeforeInstall(e) {
      e.preventDefault();
      setDeferredPrompt(e);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  function isIos() {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent.toLowerCase() : "";
    return /iphone|ipad|ipod/.test(ua) && !("standalone" in window.navigator && window.navigator.standalone);
  }

  async function handleInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      try {
        await deferredPrompt.userChoice;
      } catch (e) {
        // ignore
      }
      setDeferredPrompt(null);
    } else {
      // No native prompt (likely iOS) — show a brief hint
      setShowHint(true);
      setTimeout(() => setShowHint(false), 7500);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleInstall}
        aria-label="Installer l'application"
        title="Installer l'application"
        className="ml-3 p-2 rounded-full bg-white/90 text-indigo-700 hover:bg-white/95 transition shadow-sm"
      >
        <IconPlus className="w-4 h-4" />
      </button>

      {showHint && (
        <div className="fixed right-4 top-20 z-50 max-w-xs w-[calc(100%-2rem)] sm:w-auto bg-white text-gray-800 p-3 rounded-lg shadow-lg leading-tight">
          <div className="font-semibold">Installer l'application</div>
          <div className="text-xs mt-1">
            {isIos() ? (
              <>
                Sur iPhone/iPad : appuyez sur le bouton <span className="font-medium">Partager</span> puis
                choisissez <span className="font-medium">Sur l'écran d'accueil</span>.
              </>
            ) : (
              "Utilisez le menu du navigateur et sélectionnez Ajouter à l'écran d'accueil."
            )}
          </div>
        </div>
      )}
    </div>
  );
}
