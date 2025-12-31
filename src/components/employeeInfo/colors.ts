export const getDepartmentColor = (department?: string): string => {
  const colors: Record<string, string> = {
    Engineering: "bg-blue-50 text-blue-700 border-blue-200",
    "Human Resources": "bg-pink-50 text-pink-700 border-pink-200",
    Marketing: "bg-orange-50 text-orange-700 border-orange-200",
    Sales: "bg-green-50 text-green-700 border-green-200",
    Finance: "bg-purple-50 text-purple-700 border-purple-200",
    Operations: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Product: "bg-cyan-50 text-cyan-700 border-cyan-200",
    Design: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return colors[department || ""] || "bg-gray-50 text-gray-700 border-gray-200";
};

export const getStatusColor = (role?: string): string => {
  const colors: Record<string, string> = {
    admin: "bg-red-50 text-red-700 border-red-200",
    employee: "bg-green-50 text-green-700 border-green-200",
  };

  return colors[role || ""] || "bg-gray-50 text-gray-700 border-gray-200";
};
