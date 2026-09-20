// Live database indicator on the overview page (server-rendered).
export function DbStatusCard({ connected }: { connected: boolean }) {
  return (
    <div className="glass p-5 flex items-center gap-3">
      <span className={`w-2.5 h-2.5 rounded-full ${connected ? "bg-emerald-400" : "bg-red-400"}`} />
      <div>
        <p className="text-sm font-medium">Database</p>
        <p className="text-xs text-white/50">
          {connected ? "Connected - migrations can run" : "Not connected - add a DATABASE_URL"}
        </p>
      </div>
    </div>
  );
}
