import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
import { Button } from './Button';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible card component with header, content, and footer sections. Built with Tailwind CSS and supports all standard HTML div attributes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the card',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// Basic card examples
export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content area of the card.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Newsletter</CardTitle>
        <CardDescription>Get updates delivered to your inbox</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Subscribe to our newsletter for the latest updates and news.</p>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Subscribe</Button>
      </CardFooter>
    </Card>
  ),
};

export const ProductCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Premium Plan</CardTitle>
        <CardDescription>Everything you need to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$29/month</div>
        <ul className="mt-4 space-y-2 text-sm">
          <li>✓ Unlimited projects</li>
          <li>✓ 24/7 support</li>
          <li>✓ Advanced analytics</li>
          <li>✓ Custom integrations</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Get Started</Button>
      </CardFooter>
    </Card>
  ),
};

export const StatisticsCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Total Revenue</CardTitle>
        <CardDescription>January - December 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">$45,231.89</div>
        <p className="text-xs text-muted-foreground mt-1">
          +20.1% from last month
        </p>
      </CardContent>
    </Card>
  ),
};

export const ProfileCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
            JD
          </div>
          <div>
            <CardTitle className="text-lg">John Doe</CardTitle>
            <CardDescription>Software Engineer</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          Passionate full-stack developer with 5+ years of experience building scalable web applications.
        </p>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline" size="sm">Message</Button>
        <Button size="sm">Connect</Button>
      </CardFooter>
    </Card>
  ),
};

export const NotificationCard: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="text-lg">System Update</CardTitle>
        <CardDescription>2 hours ago</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          Your system has been successfully updated to version 2.1.0. 
          New features include improved performance and bug fixes.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="ml-auto">
          Dismiss
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const ArticleCard: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Getting Started with React</CardTitle>
        <CardDescription>Published on March 15, 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-48 bg-muted rounded-md mb-4"></div>
        <p className="text-sm">
          Learn the fundamentals of React and how to build your first component-based application...
        </p>
      </CardContent>
      <CardFooter className="justify-between">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">Save</Button>
          <Button variant="outline" size="sm">Share</Button>
        </div>
        <Button size="sm">Read More</Button>
      </CardFooter>
    </Card>
  ),
};

// Component composition examples
export const CardComponents: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Individual Components</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-4">
            <CardTitle>Card Title Only</CardTitle>
          </Card>
          
          <Card className="p-4">
            <CardDescription>Card Description Only</CardDescription>
          </Card>
          
          <Card>
            <CardContent>
              <p>Content Only</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Size Variations</h3>
        <div className="space-y-4">
          <Card className="w-[250px]">
            <CardHeader>
              <CardTitle className="text-sm">Small Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs">Compact content</p>
            </CardContent>
          </Card>
          
          <Card className="w-[500px]">
            <CardHeader>
              <CardTitle>Large Card</CardTitle>
              <CardDescription>More space for content</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card has more room for detailed content and longer descriptions.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Interactive examples
export const Interactive: Story = {
  render: () => {
    const [count, setCount] = React.useState(0);
    
    return (
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle>Interactive Counter</CardTitle>
          <CardDescription>Click the button to increment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-center py-4">
            {count}
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Button onClick={() => setCount(count + 1)}>
            Increment
          </Button>
        </CardFooter>
      </Card>
    );
  },
};

// Custom styling examples
export const CustomStyling: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="w-[300px] border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Blue Theme</CardTitle>
          <CardDescription className="text-blue-600">Custom blue styling</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700">This card uses custom blue theming.</p>
        </CardContent>
      </Card>
      
      <Card className="w-[300px] border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800">Success Card</CardTitle>
          <CardDescription className="text-green-600">Operation completed</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-green-700">✓ Everything looks good!</p>
        </CardContent>
      </Card>
      
      <Card className="w-[300px] border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800">Error Card</CardTitle>
          <CardDescription className="text-red-600">Something went wrong</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-700">✗ Please check your input and try again.</p>
        </CardContent>
      </Card>
      
      <Card className="w-[300px] shadow-lg border-2">
        <CardHeader>
          <CardTitle>Enhanced Shadow</CardTitle>
          <CardDescription>Card with stronger border and shadow</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card stands out with enhanced styling.</p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}; 