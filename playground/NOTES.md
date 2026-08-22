# NOTES: Hand-built A11y Components vs shadcn/ui (Dialog + Tabs)

This comparison is based on reading the generated shadcn/ui source for `dialog` and `tabs` (Radix UI-based) and comparing it to my from-scratch implementations in the playground.

## Dialog (Modal): gaps I found

### 1) Rendering via Portal + layering behavior
- My version:
  - Renders the modal inline where the component is mounted (normal DOM position).
  - This can cause stacking-context/z-index issues depending on parent layout and makes it easier for the dialog to be clipped by overflow containers.
- shadcn/ui version:
  - Uses a Portal-based approach (Dialog content/overlay rendered at a top-level portal).
  - This avoids clipping/stacking issues and is a more robust default for real apps.

### 2) “Hide background from screen readers” / modal isolation
- My version:
  - Uses `role="dialog"` and `aria-modal="true"` and traps focus, but it does not actively hide the rest of the page from assistive technologies.
  - Background content may still be discoverable to screen readers depending on AT/browser behavior.
- shadcn/ui version:
  - Implements stronger modal isolation behavior (Radix handles “hiding others” so screen readers don’t navigate the background content while the dialog is open).

### 3) Scroll locking + outside pointer interactions
- My version:
  - Does not lock body scrolling by default while the dialog is open.
  - Outside-click close is handled with a simple overlay click check, which is easy to get wrong for nested elements or pointer edge cases.
- shadcn/ui version:
  - Handles outside pointer interactions and dismissal in a more complete way (overlay/dismiss layer behavior) and typically prevents background scroll while open.

### 4) Focus trap robustness (focus guards / edge cases)
- My version:
  - Implements focus trapping by querying focusable elements and cycling on Tab/Shift+Tab.
  - This works for basic cases but can break with dynamic content changes, conditional disabling, or complex focusables.
- shadcn/ui version:
  - Uses a dedicated focus management implementation (Radix focus scope behavior), which is more resilient and handles edge cases more consistently.

## Tabs: gaps I found

### 1) Full roving-focus behavior + edge cases (disabled, orientation, etc.)
- My version:
  - Implements arrow-key navigation and active tab state manually.
  - Does not handle all optional ARIA APG considerations (e.g., disabled tabs, vertical orientation, or more advanced focus rules) unless I explicitly add them.
- shadcn/ui version:
  - Comes with a complete, standardized keyboard interaction model out of the box (Radix Tabs), including the expected roles/attributes and robust focus handling.

### 2) Styling/state attributes and consistency
- My version:
  - I manually manage classes for “active” tab and panel visibility.
  - Any additional states require extra manual wiring.
- shadcn/ui version:
  - Exposes consistent state hooks via attributes (e.g., state-based styling patterns), making it easier to style active/inactive states without reinventing logic.

## Summary (what shadcn handled that I initially missed)
1. Portal rendering + reliable layering for dialogs.
2. Stronger modal isolation from assistive tech (background hiding / “hide others” behavior).
3. More robust focus management and dismissal/interaction handling for dialogs.
4. Tabs behavior that is standardized and handles more edge cases with less custom code.