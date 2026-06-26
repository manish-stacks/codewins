export function Pill({ on, yes = "Yes", no = "No" }: { on: boolean; yes?: string; no?: string }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${on ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
      {on ? yes : no}
    </span>
  );
}
