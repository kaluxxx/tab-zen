export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    development: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    social: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    media: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    shopping: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    productivity: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    documentation: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    news: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    entertainment: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    education: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };
  return colors[category] || colors.other;
};