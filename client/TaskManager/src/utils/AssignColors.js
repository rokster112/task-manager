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

export const hoverBackgroundColors = {
  1: "hover:bg-yellow-300",
  2: "hover:bg-gray-300",
  3: "hover:bg-green-300",
  4: "hover:bg-red-300",
  5: "hover:bg-blue-300",
};
export const backgroundColors = {
  1: "bg-yellow-300",
  2: "bg-gray-300",
  3: "bg-green-300",
  4: "bg-red-300",
  5: "bg-blue-300",
};
