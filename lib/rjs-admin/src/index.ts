// Styles
import "./styles/globals.css";

// Layouts
export { SingleColumnLayout } from "./layout/SingleColumnLayout";
export { ThreeColumnLayout } from "./layout/ThreeColumnLayout";
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

// Data Table Components
export {
  DataTable,
  HeaderComponent,
  PaginationControls,
  ResourceDataTable,
  RowComponent,
} from "./components/data-table";

export type {
  DataTableProps,
  FieldMetadata,
  FilterConfig,
  HeaderComponentProps,
  PaginationConfig,
  PaginationControlsProps,
  QueryMetadata,
  RowComponentProps,
  SortConfig,
} from "./components/data-table";

// Query Builder Components
export {
  FieldSelector,
  QueryBuilder,
  QueryBuilderModal,
  SortBuilder,
} from "./components/query-builder";

export type {
  FieldSelectorProps,
  FilterBuilderProps,
  FilterRule,
  QueryBuilderModalProps,
  QueryBuilderProps,
  QueryBuilderState,
  ResourceQuery,
  SortBuilderProps,
  SortRule,
} from "./components/query-builder";

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
