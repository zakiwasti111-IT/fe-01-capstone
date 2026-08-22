import React, { useId, useState } from "react";

type DisclosureProps = {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export function Disclosure({ label, children, defaultOpen = false }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const buttonId = useId();
  const panelId = useId();

  return (
    <div className="disclosure">
      <button
        id={buttonId}
        type="button"
        className="disclosureButton"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!open}
        className="disclosurePanel"
      >
        {children}
      </div>
    </div>
  );
}