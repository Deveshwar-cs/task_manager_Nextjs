type TaskCardProps = {
  title: string;
  completed: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

export default function TaskCard({
  title,
  completed,
  onToggle,
  onDelete,
}: TaskCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
      <span
        className={`min-w-0 flex-1 break-words text-sm font-medium sm:text-base ${
          completed ? "text-gray-400 line-through" : "text-gray-800"
        }`}
      >
        {title}
      </span>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onToggle}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            completed
              ? "bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500"
              : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
          }`}
        >
          {completed ? "✓ Completed" : "Mark complete"}
        </button>

        <button
          onClick={onDelete}
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors duration-200 hover:border-red-300 hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-red-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
