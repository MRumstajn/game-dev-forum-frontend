const { preset, color } = require("@tiller-ds/theme");

module.exports = {
  presets: [preset],
  theme: {
    extend: {
      screens: {
        "-sm": { max: "639px" },
        "controls-mobile": { max: "450px" },
        "controls-large": { min: "450px" },
        "nav-break": { min: "870px" },
      },
      colors: {
        // brand default primary value from preset
        primary: color(
          "blue",
          // optional overrides for default, dark, light and contrast values (defaults are used here)
          {
            default: "600",
            dark: "800",
            light: "100",
            contrast: "white",
          }
        ),
        // you can define overrides for all other colors as well (secondary, tertiary, success, danger, warning, info)
      },
    },
  },
};
