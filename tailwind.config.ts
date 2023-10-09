/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontSize: {
      "heading2-bold": [
        "30px",
        {
          lineHeight: "140%",
          fontWeight: "700",
        },
      ],
    },
    fontWeight: {
      thin: "100",
      hairline: "100",
      extralight: "200",
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      "extra-bold": "800",
      black: "900",
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        robo: ["var(--font-roboto)"],
      },
      colors: {
        "dark-1": "#000000",
        "dark-2": "#2a2c2d",
        "dark-3": "#abb1b5",
        "dark-4": "#1D1F23",
        "dark-5": "#242D34",
        "dark-6": "#6b6464",
        "dark-7": "#e7e9ea",
        "light-1": "#FFFFFF",
        "light-2": "#d6cbcb",
        "light-3": "##D4D6D7",
        "primary-1": "#1A8CD8",
        "primary-2": "#1f7ab7",
      },
      rotate: {
        "210": "180deg",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
