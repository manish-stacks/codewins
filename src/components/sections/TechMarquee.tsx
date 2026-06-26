import Image from "next/image";
import { MarqueeRow } from "@/components/anim/MarqueeRow";
import { getTechStack, type TechStackItem } from "@/server/queries";

function Item({ item }: { item: TechStackItem }) {
  if (item.image) {
    return (
      <span
        title={item.label}
        className="mx-7 flex h-16 shrink-0 items-center gap-3 grayscale transition-all duration-300 hover:grayscale-0"
      >
        <Image
          src={item.image}
          alt={item.label}
          title={item.label}
          width={48}
          height={48}
          className="h-10 w-auto object-contain lg:h-12"
        />
        <span className="font-display text-xl font-semibold tracking-tight text-ink/30 lg:text-2xl">
          {item.label}
        </span>
      </span>
    );
  }
  return (
    <span
      title={item.label}
      className="mx-7 flex h-16 shrink-0 items-center font-display text-2xl font-semibold tracking-tight text-ink/25 transition-colors duration-300 hover:text-accent lg:text-3xl"
    >
      {item.label}
    </span>
  );
}

export async function TechMarquee() {
  const techStack = await getTechStack();
  const half = Math.ceil(techStack.length / 2);
  const rowA = techStack.slice(0, half);
  const rowB = techStack.slice(half);

  return (
    <section className="border-y border-line bg-white py-14">
      <p className="mb-8 text-center text-xs uppercase tracking-[0.2em] text-secondary">The tools we build with</p>
      <MarqueeRow speed={30}>{rowA.map((c) => <Item key={c.label} item={c} />)}</MarqueeRow>
      <MarqueeRow speed={34} reverse className="mt-2">{rowB.map((c) => <Item key={c.label} item={c} />)}</MarqueeRow>
    </section>
  );
}
