import Navigation from "@/components/Header";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4 text-foreground">About</h1>
        <p className="text-muted-foreground">
          This is the about page.
        </p>
      </main>
      <Footer />
    </div>
  );
}
