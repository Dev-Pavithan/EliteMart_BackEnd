let counter = 1;

export const generateUniqueId = (prefix) => {
  return `${prefix}_${String(counter++).padStart(3, "0")}`;
};
