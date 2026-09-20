// Friendly empty state for lists/grids (spec section 2).
export function EmptyState({ title, message, action }: { title: string; message?: string; action?: React.ReactNode }) {
  return (
    <div className="glass p-12 text-center">
      <p className="text-lg font-medium">{title}</p>
      {message && <p className="text-sm text-white/50 mt-2">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
