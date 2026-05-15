import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientLogic from "@/components/ClientLogic";
import { ThemeProvider } from "@/components/ThemeProvider";
import ContentProtection from "@/components/ContentProtection";

export const metadata: Metadata = {
  title: "Darshan Prajapati - Creative Developer & Graphic Designer",
  description:
    "Explore the portfolio of Darshan Prajapati, a creative developer and graphic designer specializing in web/mobile apps, UI/UX, and building beautiful, functional digital experiences.",
  keywords:
    "Darshan Prajapati, Creative Developer, Graphic Designer, Developer Near me, Graphic Designer Near me, Full Stack Developer Near me, Website builder near me, Creative Website Designer, Virtual Card Generator, Portfolio",
  authors: [{ name: "Darshan Prajapati" }],
  robots: "index, follow",
  openGraph: {
    title: "Darshan Prajapati - Creative Developer & Graphic Designer",
    description:
      "Explore the portfolio of Darshan Prajapati, a creative developer and graphic designer specializing in building innovative web/mobile apps and stunning visual designs.",
    images: [{ url: "/Logos/favicon.png" }],
    url: "https://darshan-prajapati.com", // Replace with your actual domain
  },
  twitter: {
    card: "summary_large_image",
    title: "Darshan Prajapati - Creative Developer & Graphic Designer",
    description:
      "Explore the portfolio of Darshan Prajapati, a creative developer and graphic designer specializing in building innovative web/mobile apps and stunning visual designs.",
    images: ["/Logos/favicon.png"],
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link rel="icon" type="image/png" href="/Logos/favicon.png" />
        <link rel="apple-touch-icon" href="/Logos/favicon.png" />
        <script src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.7.1/dist/dotlottie-wc.js" type="module"></script>
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <ContentProtection>
            <ClientLogic>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="container flex-grow">
                  {children}
                </main>
                <Footer />
              </div>
            </ClientLogic>
          </ContentProtection>
        </ThemeProvider>
        <Script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js" />
      </body>
    </html>
  );
}
