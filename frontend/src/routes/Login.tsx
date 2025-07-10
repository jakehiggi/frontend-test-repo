import Navigation from "@/components/Header";
import Footer from "@/components/Footer";

export default function Login() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <Navigation />
      <main className="flex-1 max-w-md mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white text-center">Log In</h1>
        <p className="text-gray-700 dark:text-gray-300 text-center">
          Login form goes here.
        </p>
      </main>
      <Footer />
    </div>
  );
}
