// utils/dataUtils.js

export const getLast5YearsData = (data, sectors) => {
    const last5Years = data.slice(-5);
    return last5Years.map(item => {
      let entry = { Year: item.Year };
      sectors.forEach(sector => {
        entry[sector] = item[sector];
      });
      return entry;
    });
  };
  
  export const getTotalEmissions = (data) => {
    return data.reduce((acc, curr) => acc + curr['Power sector/GWh'], 0);
  };
  
  export const getTotalMitigations = (data) => {
    return data.reduce((acc, curr) => acc + curr['Thermal/GWh'], 0); // Adjust this if needed
  };
  