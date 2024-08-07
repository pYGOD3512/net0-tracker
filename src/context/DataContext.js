// src/context/DataContext.js

import React, { createContext, useState, useContext } from 'react';

// Create a context
const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [uploadedData, setUploadedData] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState({});

  return (
    <DataContext.Provider value={{ uploadedData, setUploadedData, selectedColumns, setSelectedColumns }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the DataContext
export const useDataContext = () => useContext(DataContext);
