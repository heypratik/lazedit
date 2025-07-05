import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "LazeEdit Blog",
  description:
    "Learn and explore the world of LazeEdit through our blog posts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen bg-black">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
