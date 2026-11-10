export const C = {
  primary: "#000000",
  secondary: "var(--brand-violet)",
  surface: "#f7f9fb",
  surfaceLow: "#f2f4f6",
  surfaceLowest: "#ffffff",
  surfaceHigh: "#e6e8ea",
  primaryContainer: "#111c2d",
  secondaryFixed: "#dbe1ff",
  secondaryFixedDim: "#b4c5ff",
  primaryFixed: "#d8e3fb",
  primaryFixedDim: "#bcc7de",
  onSurface: "#191c1e",
  onSurfaceVariant: "#45464d",
  onPrimaryFixed: "#111c2d",
  onPrimaryFixedVariant: "#3c475a",
  onSecondaryFixedVariant: "#003ea8",
  outlineVariant: "#c6c6cd",
};

export const HL = {
  fontFamily: "var(--font-headline, 'Plus Jakarta Sans', sans-serif)",
};

export const BD = {
  fontFamily: "var(--font-body, 'Manrope', sans-serif)",
};

export const SHADOW = {
  boxShadow: "0 20px 40px rgba(25, 28, 30, 0.04)",
};

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export const stagger = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay },
  },
});

export const slideRight = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export const VIEWPORT = { once: true, margin: "-80px" };
