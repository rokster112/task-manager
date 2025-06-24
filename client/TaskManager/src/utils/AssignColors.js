export function StatusColor(key) {
  const colorStyle =
    key === "Created"
      ? "#60a5fa"
      : key === "In Progress"
      ? "#fbbf24"
      : key === "On Hold"
      ? "#9ca3af"
      : key === "Completed"
      ? "#4ade80"
      : key === "Cancelled"
      ? "#f87171"
      : "#9069ff";
  return colorStyle;
}

export function PriorityColor(key) {
  const priorityColor =
    key === "Low"
      ? "#22c55e"
      : key === "Medium"
      ? "#f4ee20"
      : key === "High"
      ? "#f49b20"
      : "#ef4444";
  return priorityColor;
}
