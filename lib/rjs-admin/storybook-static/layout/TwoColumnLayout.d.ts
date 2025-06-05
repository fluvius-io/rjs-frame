import { default as React } from '../../../../node_modules/react';
import { PageLayout } from 'rjs-frame';

export interface TwoColumnLayoutProps {
    className?: string;
    sidebarWidth?: 'sm' | 'md' | 'lg';
    children?: React.ReactNode;
}
export declare class TwoColumnLayout extends PageLayout {
    renderContent(): import("react/jsx-runtime").JSX.Element;
}
