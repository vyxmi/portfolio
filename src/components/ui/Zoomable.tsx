"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

// Wraps an already-rendered image (any size/format) so clicking it opens
// a full-screen zoom. The trigger renders exactly what's passed in —
// this only owns the open/close state and the overlay.
//
// The overlay is portaled straight to document.body rather than rendered
// inline. Case-study images sit inside ScrollReveal, which sets a
// permanent `transform: translateY(0)` once revealed — any non-none
// transform on an ancestor makes it the containing block for this
// overlay's `position: fixed`, so without the portal the "full-screen"
// zoom was only ever as big as the small image container it lived in.
// Portaling to body sidesteps that regardless of what future ancestors do.
export default function Zoomable({
  src,
  alt,
  children,
  transparentMedia,
}: {
  src: string;
  alt: string;
  children: ReactNode;
  // A transparently-backed image (a diagram, a line-art screenshot) reads
  // fine sitting directly on the page's own paper background, but loses
  // its contents against this overlay's near-black backdrop — the same
  // --paper-dim mat its non-transparent siblings already sit on restores
  // it here too, without giving every zoomed image a background it
  // doesn't need.
  transparentMedia?: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const overlay = open && (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={() => setOpen(false)}
      className="fixed inset-0 z-[80] flex items-center justify-center p-6 md:p-14"
      style={{
        background: "rgba(10,10,13,.92)",
        cursor: "zoom-out",
        animation: "zoomableIn 200ms var(--e-out)",
      }}
    >
      {transparentMedia ? (
        // A wrapping div breaks the img's own max-h-full/max-w-full (that
        // percentage math needs a parent with a *definite* height, which
        // an auto-sized wrapper doesn't have) — sized in viewport units
        // instead so containment holds regardless of what wraps it.
        <div
          style={{
            background: "var(--paper-dim)",
            padding: 24,
            boxShadow: "0 30px 80px rgba(0,0,0,.5)",
            maxWidth: "calc(100vw - 96px)",
            maxHeight: "calc(100vh - 96px)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="block object-contain"
            style={{ maxWidth: "calc(100vw - 144px)", maxHeight: "calc(100vh - 144px)" }}
          />
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="max-h-full max-w-full object-contain"
          style={{ boxShadow: "0 30px 80px rgba(0,0,0,.5)" }}
        />
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(false);
        }}
        aria-label="close"
        className="absolute right-5 top-5 font-mono text-[13px] lowercase transition-opacity duration-150 hover:opacity-70"
        style={{ color: "rgba(243,243,246,.75)" }}
      >
        close &#10005;
      </button>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-cursor="focus"
        className="block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left"
        aria-label={`expand image: ${alt}`}
      >
        {children}
      </button>
      {overlay ? createPortal(overlay, document.body) : null}
      <style>{`@keyframes zoomableIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </>
  );
}
