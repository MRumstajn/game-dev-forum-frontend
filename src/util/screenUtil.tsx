import { NAVBAR_BREAKPOINT_PX } from "../common/constants";

export function isScreenBelowNavbarBreakpoint(): boolean {
  return window.innerWidth < NAVBAR_BREAKPOINT_PX;
}
