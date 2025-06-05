import { default as React } from '../../../../node_modules/react';
import { PageLayout } from 'rjs-frame';

export interface SingleColumnLayoutProps {
    className?: string;
    children?: React.ReactNode;
}
export declare class SingleColumnLayout extends PageLayout {
    renderContent(): import("react/jsx-runtime").JSX.Element;
}
