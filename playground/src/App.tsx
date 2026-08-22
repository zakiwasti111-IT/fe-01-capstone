import { useRef, useState } from "react";
import "./App.css";
import { ModalDialog } from "./components/ModalDialog";
import { Tabs } from "./components/Tabs";
import { Disclosure } from "./components/Disclosure";

export default function App() {
  const [open, setOpen] = useState(false);
  const openBtnRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="page">
      <h1>Accessibility Playground</h1>

      <section>
        <h2>Modal Dialog</h2>
        <button
          ref={openBtnRef}
          onClick={() => setOpen(true)}
        >
          Open modal
        </button>

        <ModalDialog
          open={open}
          title="Example Modal"
          onClose={() => setOpen(false)}
        >
          <p>Try keyboard-only: Tab should stay inside this modal.</p>
          <label>
            Example input
            <input type="text" />
          </label>
          <button type="button">Another button</button>
        </ModalDialog>
      </section>

      <section>
        <h2>Tabs</h2>
        <p>Keyboard: Tab into tabs, use Arrow keys, then Enter/Space to activate.</p>
        <Tabs
          items={[
            { id: "one", label: "Tab One", content: <p>Panel one content</p> },
            { id: "two", label: "Tab Two", content: <p>Panel two content</p> },
            { id: "three", label: "Tab Three", content: <p>Panel three content</p> },
          ]}
        />
      </section>

      <section>
        <h2>Disclosure</h2>
        <Disclosure label="Show details">
          <p>This content is revealed when expanded.</p>
        </Disclosure>
      </section>
    </div>
  );
}