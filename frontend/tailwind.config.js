export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background:               "#0a0a0a",
        surface:                  "#111111",
        "surface-container-low":  "#1a1a1a",
        "surface-container-lowest":"#141414",
        "surface-container-high": "#222222",
        primary:                  "#e8c97e",       // warm gold accent
        "primary-dim":            "#d4b46a",       // slightly dimmer gold
        "on-primary":             "#0a0a0a",       // dark text on gold button
        "on-surface":             "#f0ede8",       // off-white body text
        "on-surface-variant":     "#888580",       // muted grey
        "outline-variant":        "#2e2e2e",       // subtle borders
        accent:                   "#e8c97e",
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', "serif"],
        sans:  ['"Inter"', '"Helvetica Neue"', "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #0a0a0a 0%, #141414 50%, #0f0f0f 100%)",
      },
      boxShadow: {
        "card-dark": "0 8px 32px rgba(0,0,0,0.6)",
        "glow-gold":  "0 0 20px rgba(232,201,126,0.15)",
      },
      animation: {
        "fade-up":   "fadeUp 0.5s ease forwards",
        "shimmer":   "shimmer 2s infinite linear",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
}
