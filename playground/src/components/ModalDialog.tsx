import React, { useEffect, useMemo, useRef } from "react";

type ModalDialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function ModalDialog({ open, title, onClose, children }: ModalDialogProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const titleId = useMemo(() => "modal-title", []);

  useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    // Focus the first focusable element inside the dialog (or the dialog itself)
    const dialogEl = dialogRef.current;
    if (!dialogEl) return;

    const focusables = Array.from(
      dialogEl.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    );
    (focusables[0] ?? dialogEl).focus();
  }, [open]);

  useEffect(() => {
    if (open) return;

    // Return focus to whatever opened the modal
    previouslyFocusedRef.current?.focus?.();
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }

    if (e.key !== "Tab") return;

    const dialogEl = dialogRef.current;
    if (!dialogEl) return;

    const focusables = Array.from(
      dialogEl.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    ).filter((el) => !el.hasAttribute("disabled"));

    if (focusables.length === 0) {
      e.preventDefault();
      dialogEl.focus();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    }
  };

  if (!open) return null;

  return (
    <div
      aria-hidden="false"
      className="overlay"
      onMouseDown={(e) => {
        // click outside closes (mouse only). keyboard close is Escape.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="dialog"
        onKeyDown={onKeyDown}
      >
        <div className="dialogHeader">
          <h2 id={titleId}>{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </div>

        <div className="dialogBody">{children}</div>

        <div className="dialogFooter">
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}