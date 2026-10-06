import { useEffect, useRef } from "react";

// Klik kanan hanya boleh di dalam editor kode (menu Monaco sendiri, tanpa Google Lens).
// Di tempat lain: menu dimatikan, dan kalau yang klik mouse sungguhan -> onViolation().
const ALLOWED = "[data-allow-contextmenu], .context-view";

export function useRightClickGuard(enabled: boolean, onViolation: () => void) {
  const cb = useRef(onViolation);
  cb.current = onViolation;

  useEffect(() => {
    if (!enabled) return;

    const handler = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (target?.closest?.(ALLOWED)) return;

      e.preventDefault();
      e.stopPropagation();

      // Tekan lama di HP / stylus memunculkan event yang sama; cukup diblok, tanpa penalti
      const type = (e as PointerEvent).pointerType;
      if (type === "touch" || type === "pen") return;

      cb.current();
    };

    document.addEventListener("contextmenu", handler, true);
    return () => document.removeEventListener("contextmenu", handler, true);
  }, [enabled]);
}