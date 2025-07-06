import "./globals.css";
import { Inter } from "next/font/google";
import ClientLayout from "@/components/ClientLayout";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LazeEdit - AI Image Editor | Best Photoshop Alternative 2025",
  description:
    "Edit images by just telling LazeEdit what you want. Remove backgrounds, change text, create banners — no design skills needed. Free Photoshop alternative with AI magic. Try now!",
  metadataBase: new URL("https://www.lazedit.com"),
  openGraph: {
    title: "LazeEdit - AI Image Editor | Best Photoshop Alternative 2025",
    description: "Edit images by just telling LazeEdit what you want...",
    url: "https://www.lazedit.com",
    siteName: "LazeEdit",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LazeEdit AI Image Editor Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LazeEdit - AI Image Editor | Best Photoshop Alternative 2025",
    description: "Edit images by just telling LazeEdit what you want...",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon-logo.png",
    apple: "/icon-logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>

        {/* Tawk.to live chat script */}
        <Script
          id="tawkto-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/686a6194f471f4190bc9ed4f/1ivfoqb37';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />

        <GoogleAnalytics gaId="G-H4YGV6B32T" />
      </body>
    </html>
  );
}
