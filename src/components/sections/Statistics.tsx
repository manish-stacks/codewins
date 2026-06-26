import { Section } from "@/components/ui/Section";
import { Counter } from "@/components/anim/Counter";
import { Reveal } from "@/components/anim/Reveal";
import { getStats } from "@/server/queries";

export async function Statistics() {
  const stats = await getStats("home");
  return (
    <Section className="bg-ink text-white">
      <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
        <div className="grid gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={i}>
              <div className={i !== 0 ? "lg:border-l lg:border-white/12 lg:pl-10" : "lg:pl-0"}>
                <div className="font-display text-[clamp(2.75rem,6vw,4rem)] font-extrabold leading-none text-white">
                  <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <p className="mt-4 text-sm uppercase tracking-[0.14em] text-white/55">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
