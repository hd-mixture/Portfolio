import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientLogic from "@/components/ClientLogic";

export const metadata: Metadata = {
  title: "Darshan Prajapati - Creative Developer & Graphic Designer",
  description:
    "Darshan Prajapati - Creative Developer & Graphic Designer Portfolio. Showcasing web development, mobile apps, and graphic design projects.",
  keywords:
    "Darshan Prajapati, Web Developer, Graphic Designer, UI/UX, Portfolio, Creative Developer",
  authors: [{ name: "Darshan Prajapati" }],
  robots: "index, follow",
  openGraph: {
    title: "Darshan Prajapati - Creative Developer & Graphic Designer",
    description:
      "Portfolio showcasing web development, mobile apps, and graphic design projects.",
    images: [{ url: "/logos/hd_logo.png" }],
    url: "https://hd-mixture.github.io/portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Darshan Prajapati - Creative Developer & Graphic Designer",
    description:
      "Portfolio showcasing web development, mobile apps, and graphic design projects.",
    images: ["/logos/hd_logo.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link rel="icon" type="image/png" href="/logos/hd_logo.png" />
        <link rel="apple-touch-icon" href="/logos/hd_logo.png" />
      </head>
      <body>
        <ClientLogic>
            <Header />
            <div className="container">
              {children}
            </div>
            <Footer />
        </ClientLogic>
        <Script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js" />
      </body>
    </html>
  );
}
