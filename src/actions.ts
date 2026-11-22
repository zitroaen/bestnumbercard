import type { ActionConfig, HomeAssistant } from "./types";

function fire(node: HTMLElement, type: string, detail: unknown): void {
  node.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
}

/** Execute a standard Home Assistant action config. Returns false for unknown actions. */
export function runAction(
  node: HTMLElement,
  hass: HomeAssistant,
  action: ActionConfig | undefined,
  entityId: string | undefined,
): boolean {
  if (!action || action.action === "none") return true;
  const a = action as any;
  // optional "Are you sure?" dialog, like the built-in cards
  if (a.confirmation) {
    const text = typeof a.confirmation === "object" && a.confirmation.text ? a.confirmation.text : "Are you sure?";
    if (!window.confirm(text)) return true;
  }
  switch (action.action) {
    case "more-info": {
      const id = a.entity ?? entityId;
      if (id) fire(node, "hass-more-info", { entityId: id });
      return true;
    }
    case "toggle":
      if (entityId) hass.callService("homeassistant", "toggle", { entity_id: entityId });
      return true;
    case "navigate":
      if (a.navigation_path) {
        history.pushState(null, "", a.navigation_path);
        fire(window as any, "location-changed", { replace: false });
      }
      return true;
    case "url":
      if (a.url_path) window.open(a.url_path, a.new_tab === false ? "_self" : "_blank");
      return true;
    case "perform-action":
    case "call-service": {
      const svc: string | undefined = a.perform_action ?? a.service;
      if (!svc) return true;
      const [domain, service] = svc.split(".", 2);
      hass.callService(domain, service, a.data ?? a.service_data, a.target);
      return true;
    }
    case "fire-dom-event":
      // e.g. browser_mod popups
      fire(node, "ll-custom", a);
      return true;
    default:
      return false;
  }
}
