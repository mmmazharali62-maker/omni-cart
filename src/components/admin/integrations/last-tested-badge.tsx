// Shows the most recent test result for a provider, if any.
export function LastTestedBadge({
  lastTestedAt,
  lastTestStatus,
  lastTestMessage
}: {
  lastTestedAt: string | null;
  lastTestStatus: "ok" | "fail" | null;
  lastTestMessage: string | null;
}) {
  if (!lastTestedAt || !lastTestStatus) {
    return <p className="text-xs text-white/40">Never tested</p>;
  }
  const when = new Date(lastTestedAt).toLocaleString();
  return (
    <p className={`text-xs ${lastTestStatus === "ok" ? "text-emerald-400" : "text-red-400"}`} title={lastTestMessage ?? undefined}>
      Last test {lastTestStatus === "ok" ? "passed" : "failed"} - {when}
    </p>
  );
}
