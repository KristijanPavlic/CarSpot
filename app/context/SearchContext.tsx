"use client";

import React, { createContext, useState } from "react";

interface SearchContextType {
  isSearchVisible: boolean;
  toggleSearchVisibility: () => void;
}

export const SearchContext = createContext<SearchContextType>({
  isSearchVisible: false,
  toggleSearchVisibility: () => {},
});

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleSearchVisibility = () => {
    setIsSearchVisible((prev) => !prev);
  };

  return (
    <SearchContext.Provider value={{ isSearchVisible, toggleSearchVisibility }}>
      {children}
    </SearchContext.Provider>
  );
};
