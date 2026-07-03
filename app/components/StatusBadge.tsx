export default function StatusBadge({
  status,
}: any) {
  const colors: any = {
    Aberto:
      "bg-blue-500/20 text-blue-400 border border-blue-500/30",

    "Em andamento":
      "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",

    Resolvido:
      "bg-green-500/20 text-green-400 border border-green-500/30",

    Cancelado:
      "bg-red-500/20 text-red-400 border border-red-500/30",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium ${
        colors[status] ||
        "bg-slate-700 text-white"
      }`}
    >
      {status}
    </span>
  );
}