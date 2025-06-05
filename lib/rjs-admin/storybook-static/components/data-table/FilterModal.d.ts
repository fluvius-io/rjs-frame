import { default as React } from '../../../../../node_modules/react';
import { ResourceQuery } from '../query-builder/types';
import { QueryMetadata } from './types';

export interface FilterModalProps {
    isOpen: boolean;
    metadata: QueryMetadata;
    currentQuery?: string;
    onClose: () => void;
    onApply: (query: ResourceQuery) => void;
}
declare const FilterModal: React.FC<FilterModalProps>;
export default FilterModal;
