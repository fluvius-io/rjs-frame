import { Meta, StoryObj } from '@storybook/react';
import { default as ResourceDataTable } from './ResourceDataTable';

declare const meta: Meta<typeof ResourceDataTable>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const WithApiMetadataAndData: Story;
export declare const OrganizationsFromApi: Story;
export declare const WithApiMetadata: Story;
export declare const DirectApiMetadata: Story;
export declare const ServerNotRunning: Story;
