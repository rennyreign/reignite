/**
 * Formats a date to the format "MMM-D YYYY" (e.g., "Jun-6 2025")
 * @param {string|Date} date - The date to format
 * @returns {string} The formatted date string or "Invalid Date" if the date is invalid
 */
export const formatDate = (date) => {
  if (!date) return 'Not specified';
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return 'Invalid Date';
    
    const month = dateObj.toLocaleString('en-US', { month: 'short' });
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    
    return `${month}-${day} ${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};
