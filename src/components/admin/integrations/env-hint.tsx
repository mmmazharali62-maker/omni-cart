// Notes that env vars still take precedence, so nothing breaks pre-setup.
export function EnvHint({ envFallback }: { envFallback?: Record<string, string> }) {
  if (!envFallback || Object.keys(envFallback).length === 0) return null;
  const names = Object.values(envFallback);
  return (
    <p className="text-xs text-white/40 mt-3">
      If the {names.map((n) => <code key={n} className="font-mono">{n}</code>).reduce<React.ReactNode[]>((acc, el, i) => (i === 0 ? [el] : [...acc, " / ", el]), [])}{" "}
      env var{names.length > 1 ? "s are" : " is"} set at deploy time, that value wins over what's saved here.
    </p>
  );
}
