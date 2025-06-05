import { FilterBuilderProps } from './types';

declare const AddFilterDropdown: import('../../../../../node_modules/react').NamedExoticComponent<{
    metadata: any;
    onAddFilter: (fieldName: string) => void;
    onAddGroup?: (operator: ":and" | ":or") => void;
    disabled?: boolean;
    showGroupOptions?: boolean;
}>;
declare const FilterBuilder: import('../../../../../node_modules/react').NamedExoticComponent<FilterBuilderProps>;
export { AddFilterDropdown };
export default FilterBuilder;
