import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <header className="w-full px-4 py-2 bg-white shadow-md flex justify-between items-center">
          <h1 className="text-2xl font-bold">WhatsApp AI Solution</h1>
          <div>
            <Link href="/login" className="mx-2 text-blue-500">
              Login
            </Link>
            <Link href="/register" className="mx-2 text-green-500">
              Register
            </Link>
          </div>
        </header>
        <section className="flex flex-col items-center justify-center mt-10">
          <h2 className="text-3xl font-bold mb-4">
            Automate and Manage Your WhatsApp Interactions
          </h2>
          <p className="mb-6 text-lg text-gray-700">
            Seamlessly integrate AI-powered automation for better customer
            engagement.
          </p>
          <Link href="/register">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Get Started
            </button>
          </Link>
        </section>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        Footer here
      </footer>
    </div>
  );
}
