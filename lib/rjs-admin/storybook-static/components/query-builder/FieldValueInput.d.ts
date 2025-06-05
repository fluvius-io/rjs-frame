import { default as React } from '../../../../../node_modules/react';

export declare const FieldValueInput: React.FC<{
    widget: {
        name: string;
        desc: string | null;
        inversible: boolean;
        data_query: any | null;
    } | null;
    value: any;
    onChange: (value: any) => void;
    fieldName: string;
}>;
export default FieldValueInput;
