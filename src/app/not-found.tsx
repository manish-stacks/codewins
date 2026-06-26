import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center bg-surface">
      <div className="mx-auto max-w-content px-6 text-center sm:px-8">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Error 404</span>
        <h1 className="mt-8 font-display text-[clamp(3.5rem,12vw,9rem)] font-extrabold leading-none text-ink">Page not found</h1>
        <p className="mx-auto mt-8 max-w-md text-lg leading-relaxed text-secondary">The page you&apos;re looking for has moved or no longer exists. Let&apos;s get you back on track.</p>
        <div className="mt-10 flex justify-center"><Button href="/">Back to home</Button></div>
      </div>
    </section>
  );
}
