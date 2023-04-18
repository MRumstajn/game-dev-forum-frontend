import { NAVBAR_BREAKPOINT_PX } from "../common/constants";

export function isScreenBelowNavbarBreakpoint(): boolean {
  return window.screen.width < NAVBAR_BREAKPOINT_PX;
}
