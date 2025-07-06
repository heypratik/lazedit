import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "LazeEdit Blog",
  description:
    "Learn and explore the world of LazeEdit through our blog posts.",
};

export default function BlogLayout({ children }) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#08090a] pt-16 blog-post_content">
        <div className="content-left"></div>
        <div className="content-center">{children}</div>
        <div className="content-right"></div>
      </main>
      <Footer />
    </>
  );
}
