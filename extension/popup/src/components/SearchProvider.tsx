import React, {
  useState,
  SetStateAction,
  Dispatch,
  createContext,
} from "react";

type Query = string;

export interface SearchContextValue {
  query: Query;
  setQuery?: Dispatch<SetStateAction<Query>>;
}

const defaultQuery: Query = "";

export const SearchContext = createContext<SearchContextValue>({
  query: defaultQuery,
});

interface Props {
  children: React.ReactNode;
}

export const SearchProvider = ({ children }: Props): JSX.Element => {
  const [query, setQuery] = useState<Query>(defaultQuery);
  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
};
