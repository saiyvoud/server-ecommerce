export const ValidateData = async (data) => { // {"key": values} 
  return Object.keys(data).filter((key) => !data[key]); 
};
