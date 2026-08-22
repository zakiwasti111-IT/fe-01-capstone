import React, { useMemo, useRef, useState } from "react";

export type TabItem = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  items: TabItem[];
  defaultTabId?: string;
};

export function Tabs({ items, defaultTabId }: TabsProps) {
  const initialId = defaultTabId ?? items[0]?.id;
  const [activeId, setActiveId] = useState<string>(initialId);
  const [focusedIndex, setFocusedIndex] = useState<number>(() => {
    const idx = items.findIndex((t) => t.id === initialId);
    return idx === -1 ? 0 : idx;
  });

  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const tablistId = useMemo(() => "tablist-1", []);

  const focusTab = (index: number) => {
    setFocusedIndex(index);
    tabRefs.current[index]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const lastIndex = items.length - 1;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown": {
        e.preventDefault();
        focusTab(focusedIndex === lastIndex ? 0 : focusedIndex + 1);
        break;
      }
      case "ArrowLeft":
      case "ArrowUp": {
        e.preventDefault();
        focusTab(focusedIndex === 0 ? lastIndex : focusedIndex - 1);
        break;
      }
      case "Home": {
        e.preventDefault();
        focusTab(0);
        break;
      }
      case "End": {
        e.preventDefault();
        focusTab(lastIndex);
        break;
      }
      case "Enter":
      case " ": {
        e.preventDefault();
        setActiveId(items[focusedIndex].id);
        break;
      }
      default:
        break;
    }
  };

  return (
    <div>
      <div
        id={tablistId}
        role="tablist"
        aria-label="Demo tabs"
        className="tablist"
        onKeyDown={onKeyDown}
      >
        {items.map((tab, idx) => {
          const selected = tab.id === activeId;
          const tabId = `tab-${tab.id}`;
          const panelId = `panel-${tab.id}`;

          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              id={tabId}
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={idx === focusedIndex ? 0 : -1}
              className={selected ? "tab tabActive" : "tab"}
              onClick={() => {
                setActiveId(tab.id);
                focusTab(idx);
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {items.map((tab) => {
        const selected = tab.id === activeId;
        const tabId = `tab-${tab.id}`;
        const panelId = `panel-${tab.id}`;

        return (
          <div
            key={tab.id}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            hidden={!selected}
            className="tabpanel"
          >
            {tab.content}
          </div>
        );
      })}
    </div>
  );
}