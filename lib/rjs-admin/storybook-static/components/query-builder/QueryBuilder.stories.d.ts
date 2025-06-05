import { Meta, StoryObj } from '@storybook/react';
import { default as QueryBuilder } from './QueryBuilder';

declare const meta: Meta<typeof QueryBuilder>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const BasicQueryBuilder: Story;
export declare const WithInitialState: Story;
export declare const CompactMode: Story;
export declare const WithLiveDataExecution: Story;
export declare const FieldSelectionOnly: Story;
export declare const CompositeOperators: Story;
export declare const WithDirectMetadata: Story;
export declare const CustomSectionVisibility: Story;
