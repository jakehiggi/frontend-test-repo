import Navigation from "@/components/Header";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <Navigation />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">About</h1>
        <p className="text-gray-700 dark:text-gray-300">
          This is the about page.
        </p>
      </main>
      <Footer />
    </div>
  );
}
