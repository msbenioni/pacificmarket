export function getBadgeStyles(type) {
  const styles = {
    success: "border-green-200 bg-green-50 text-green-700",
    danger: "border-red-200 bg-red-50 text-red-700",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-700",
    info: "border-blue-200 bg-blue-50 text-blue-700",
    neutral: "border-gray-200 bg-gray-50 text-gray-700",
    premium: "border-purple-200 bg-purple-50 text-purple-700",
  };
  return styles[type] || styles.neutral;
}
