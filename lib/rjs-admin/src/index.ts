// Styles
import "./styles/globals.css";

// Layouts
export { SingleColumnLayout } from "./layout/SingleColumnLayout";
export { ThreeColumnLayout } from "./layout/ThreeColumnLayout";
export type { ThreeColumnLayoutProps } from "./layout/ThreeColumnLayout";
export { TwoColumnLayout } from "./layout/TwoColumnLayout";

// Common Components
export { AdminPanelTab } from "./components/common/AdminPanelTab";
export { AuthUserAvatar } from "./components/common/AuthUserAvatar";
export type { AuthUserAvatarProps } from "./components/common/AuthUserAvatar";
export { Button, buttonVariants } from "./components/common/Button";
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/common/Card";
export { UserAvatar } from "./components/common/UserAvatar";
export type { UserAvatarProps } from "./components/common/UserAvatar";
export { UserDialog } from "./components/common/UserDialog";
export type {
  DialogTab,
  UserDialogProps,
} from "./components/common/UserDialog";
export { UserProfileTab } from "./components/common/UserProfileTab";
export { UserSettingsTab } from "./components/common/UserSettingsTab";

// Form Components
export { Input } from "./components/form/Input";

// Entity Components
export { EntityFormat } from "./components/entity";
export type { EntityFormatProps } from "./components/entity";

// Item View Components
export { ItemView, useItemView } from "./components/itemview";
export type {
  ItemViewContextValue,
  ItemViewProps,
} from "./components/itemview";

// Data Table Components
export {
  DataTable,
  Pagination,
  TableControl,
  TableFilter,
  TableHeader,
  TableRow,
  TableView,
} from "./components/datatable";

// Query Builder Components
export {
  FilterInput,
  QueryBuilder,
  QueryBuilderModal,
  QueryBuilderPanel,
} from "./components/querybuilder";

// Query Builder Types
export type {
  DataType,
  FilterInputConfig,
  FilterInputProps,
  FilterState,
  QueryBuilderModalProps,
  QueryBuilderProps,
  QueryCompositeMetadata,
  QueryFieldMetadata,
  QueryFilterMetadata,
  QueryMetadata,
  QueryState,
  QueryStatement,
  QueryValue,
  SortItem,
} from "./types/querybuilder";

// Data Table Types
export type {
  ColumnConfig,
  DataResponse,
  DataRow,
  DataTableProps,
  LoadingState,
  PaginationProps,
  PaginationState,
  TableControlProps,
  TableFilterProps,
  TableHeaderProps,
  TableRowProps,
  TableViewProps,
} from "./types/datatable";

// Utilities
export { cn, formatDate, formatDateTime } from "./lib/utils";

// API utilities
export {
  API_BASE_URL,
  apiFetch,
  createApiUrl,
  endpoints,
  fetchJson,
} from "./lib/api";
