import { Plus_Jakarta_Sans, Manrope } from "next/font/google";

const headline = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-headline",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "TELNOVA | Premium Connectivity & Intelligence",
  description:
    "Internet, TV, mobile, and home security options in one place. Telnova.ai helps you compare available services for your address and find the setup that fits your home and budget.",
};

export default function V2Layout({ children }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
      <div className={`${headline.variable} ${body.variable}`}>{children}</div>
    </>
  );
}
