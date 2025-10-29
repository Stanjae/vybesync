import { BREAKPOINTS } from "../constants";

export const getDeviceType = (width: number) => {
  if (width < BREAKPOINTS.mobile) return "mobile";
  if (width < BREAKPOINTS.tablet) return "tablet";
  if (width < BREAKPOINTS.laptop) return "laptop";
  if (width < BREAKPOINTS.desktop) return "desktop";
  return "wide";
};
