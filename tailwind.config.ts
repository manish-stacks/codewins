import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#161514",
        carbon: "#0E0D0C",
        accent: "#D1312E",
        "accent-dark": "#A91F1D",
        secondary: "#6E6A66",
        surface: "#F4F2EF",
        "surface-200": "#E9E6E1",
        line: "#E2DED8",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        frame: "1480px",
        content: "1280px",
      },
      borderRadius: {
        card: "20px",
        "card-lg": "28px",
      },
      fontSize: {
        display: ["clamp(2.75rem, 7vw, 6.5rem)", { lineHeight: "0.98", letterSpacing: "-0.03em" }],
        heading: ["clamp(2rem, 5vw, 4rem)", { lineHeight: "1.04", letterSpacing: "-0.02em" }],
      },
      spacing: {
        section: "72px",
        "section-md": "104px",
        "section-lg": "144px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
