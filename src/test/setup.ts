import '@testing-library/jest-dom/vitest'

// Polyfills for Radix UI and JSDOM compatibility
if (typeof window !== 'undefined') {
  // Mock PointerEvent if not present (JSDOM doesn't have it)
  if (!window.PointerEvent) {
    window.PointerEvent = class PointerEvent extends MouseEvent {} as any;
  }

  // Polyfills for Pointer Capture methods on Element.prototype
  // Radix UI components like Select rely on these.
  const pointerCaptureMethods = ['hasPointerCapture', 'setPointerCapture', 'releasePointerCapture'] as const;
  pointerCaptureMethods.forEach((method) => {
    if (!window.Element.prototype[method]) {
      window.Element.prototype[method] = function () {
        return false;
      };
    }
  });

  // Polyfill scrollIntoView on Element.prototype
  if (!window.Element.prototype.scrollIntoView) {
    window.Element.prototype.scrollIntoView = function () {
      // No-op for testing environment
    };
  }

  // Mock ResizeObserver
  if (!window.ResizeObserver) {
    window.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
}
