import Navbar from '../components/Navbar';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-bg px-8 pt-32 pb-24 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-light tracking-[0.25em] text-brand-accent md:text-5xl">ABOUT</h1>
          <p className="mt-8 text-lg leading-relaxed md:text-xl">
            Placeholder copy: describe who Cerebrum One is, what you do, and who you do it for.
          </p>
        </div>
      </main>
    </>
  );
}
