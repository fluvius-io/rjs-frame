import { Meta, StoryObj } from '@storybook/react';
import { default as FilterModal } from './FilterModal';

declare const meta: Meta<typeof FilterModal>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Interactive: Story;
export declare const WithExistingFilters: Story;
export declare const Closed: Story;
