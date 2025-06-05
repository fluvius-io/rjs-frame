import { QueryMetadata } from '../data-table/types';

export interface ResourceQuery {
    select?: string[];
    sort?: string[];
    query?: string;
}
export interface QueryBuilderState {
    selectedFields: string[];
    sortRules: SortRule[];
    filterRules: FilterRule[];
}
export interface SortRule {
    field: string;
    direction: 'asc' | 'desc';
}
export interface BaseFilterRule {
    id: string;
    negate?: boolean;
}
export interface FieldFilterRule extends BaseFilterRule {
    type: 'field';
    field: string;
    operator: string;
    value: any;
}
export interface CompositeFilterRule extends BaseFilterRule {
    type: 'composite';
    operator: ':and' | ':or';
    children: FilterRule[];
}
export type FilterRule = FieldFilterRule | CompositeFilterRule;
export interface LegacyFilterRule {
    id: string;
    field: string;
    operator: string;
    value: any;
    negate: boolean;
}
export interface QueryBuilderProps {
    metadata: QueryMetadata;
    initialQuery?: Partial<QueryBuilderState>;
    onQueryChange?: (state: QueryBuilderState) => void;
    onExecute?: (state: QueryBuilderState) => void;
    title?: string;
    className?: string;
    showFieldSelection?: boolean;
    showSortRules?: boolean;
    showFilterRules?: boolean;
    showQueryDisplay?: boolean;
}
export interface FieldSelectorProps {
    metadata: QueryMetadata;
    selectedFields: string[];
    onSelectedFieldsChange: (fields: string[]) => void;
}
export interface SortBuilderProps {
    metadata: QueryMetadata;
    sortRules: SortRule[];
    onSortRulesChange: (rules: SortRule[]) => void;
}
export interface FilterBuilderProps {
    metadata: QueryMetadata;
    filterRules: FilterRule[];
    onFilterRulesChange: (rules: FilterRule[]) => void;
}
export interface CompositeFilterGroupProps {
    metadata: QueryMetadata;
    filter: CompositeFilterRule;
    onFilterChange: (filter: CompositeFilterRule) => void;
    onRemove: () => void;
    depth?: number;
    isRoot?: boolean;
}
export interface FieldFilterProps {
    metadata: QueryMetadata;
    filter: FieldFilterRule;
    onFilterChange: (filter: FieldFilterRule) => void;
    onRemove: () => void;
}
export interface QueryDisplayProps {
    query: ResourceQuery;
    onQueryChange?: (query: ResourceQuery) => void;
}
export declare function buildQueryString(filterRules: FilterRule[]): string;
export declare function parseQueryString(queryString: string): FilterRule[];
export declare function toResourceQuery(state: QueryBuilderState): ResourceQuery;
export declare function fromResourceQuery(query: ResourceQuery): QueryBuilderState;
