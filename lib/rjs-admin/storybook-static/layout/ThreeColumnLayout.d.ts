import { default as React } from '../../../../node_modules/react';
import { PageLayout } from 'rjs-frame';

export interface ThreeColumnLayoutProps {
    className?: string;
    sidebarWidth?: 'sm' | 'md' | 'lg';
    rightPanelWidth?: 'sm' | 'md' | 'lg';
    children?: React.ReactNode;
}
export declare class ThreeColumnLayout extends PageLayout {
    renderContent(): import("react/jsx-runtime").JSX.Element;
}
