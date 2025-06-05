import { default as React } from '../../../../../node_modules/react';

export interface ResourceDataTableProps {
    dataApi: string;
    title?: string;
    subtitle?: string;
    showSearch?: boolean;
    showFilters?: boolean;
    className?: string;
    actions?: React.ReactNode;
}
/**
 * A convenience component that fetches both metadata and data from API endpoints
 * This demonstrates the complete workflow of using API-driven metadata
 */
declare const ResourceDataTable: React.FC<ResourceDataTableProps>;
export default ResourceDataTable;
