import { MD_BREAKPOINT_PX, NAVBAR_BREAKPOINT_PX } from "../common/constants";

export function isScreenBelowNavbarBreakpoint(): boolean {
  return window.innerWidth < NAVBAR_BREAKPOINT_PX;
}

export function isScreenBelowMdBreakpoint() {
  return window.innerWidth < MD_BREAKPOINT_PX;
}
