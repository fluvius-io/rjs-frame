import { createContext, useContext } from "react";

// Context for ItemView sub-components
export interface ItemViewContextValue {
  item: any | null;
  loading: boolean;
  error: Error | null;
  itemId: string;
  apiName: string;
  refreshItem: () => void;
}

export const ItemViewContext = createContext<ItemViewContextValue | null>(null);

export const useItemView = () => {
  const context = useContext(ItemViewContext);
  if (!context) {
    throw new Error("useItemView must be used within an ItemView component");
  }
  return context;
};
