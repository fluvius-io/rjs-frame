import { ApiParams, PageModuleProps } from "rjs-frame";

export interface ItemViewProps {
  itemId: string;
  resourceName: string; // API endpoint name (can be "collection:queryName" or just "queryName")
  itemJsonView?: boolean;
  className?: string;
  onError?: (error: Error) => void;
  onLoad?: (data: any) => void;
  params?: ApiParams; // Additional parameters for the API call
  defaultTab?: string; // Default active tab
  children?: React.ReactNode; // Tab content components (TabItem components)
  itemIcon?: React.ElementType;
}

export interface ItemViewState {
  item: any | null;
  loading: boolean;
  error: Error | null;
  activeTab: string;
}
// TabItem component for defining named tabs
export interface TabItemProps {
  name: string;
  label: string;
  children: React.ReactNode;
}

export interface SwitcherProps extends PageModuleProps {
  paramKey: string;
}

export interface ModalViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  showCloseButton?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface SwitcherViewComponentProps
  extends ModalViewProps,
    ItemViewProps {}
