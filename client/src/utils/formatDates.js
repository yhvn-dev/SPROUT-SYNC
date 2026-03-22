

export const formatDateOnly = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const yyyy = date.getUTCFullYear();  
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0"); 
  const dd = String(date.getUTCDate()).padStart(2, "0"); 
  return `${yyyy}-${mm}-${dd}`;
};