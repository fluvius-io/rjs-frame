import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { PaginatedList } from './index';
import { Button } from '../common/Button';
import type { PaginatedListMetadata, SortConfig, FilterConfig, PaginationConfig } from './types';

// Data type definitions
interface UserData {
  id: number;
  name: string;
  email: string;
  department: string;
  status: string;
  role: string;
  salary: number;
  joinDate: Date;
  isActive: boolean;
}

interface ProductData {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  rating: number;
  inStock: boolean;
}

// Metadata configurations
const userMetadata: PaginatedListMetadata = {
  fields: {
    id: { label: 'ID', sortable: true, width: 80, align: 'center' },
    name: { label: 'Name', sortable: true },
    email: { label: 'Email', sortable: true },
    department: { label: 'Department', sortable: true },
    role: { label: 'Role', sortable: true },
    salary: { 
      label: 'Salary', 
      sortable: true, 
      type: 'number',
      align: 'right',
      format: (value) => `$${value.toLocaleString()}`
    },
    joinDate: { 
      label: 'Join Date', 
      sortable: true, 
      type: 'date'
    },
    isActive: { 
      label: 'Active', 
      sortable: true, 
      type: 'boolean',
      align: 'center'
    },
  },
  operators: {
    equals: { label: 'Equals', type: 'text' },
    contains: { label: 'Contains', type: 'text' },
    startsWith: { label: 'Starts with', type: 'text' },
    greaterThan: { label: 'Greater than', type: 'number' },
    lessThan: { label: 'Less than', type: 'number' },
    between: { label: 'Between', type: 'date' },
    isActive: { 
      label: 'Is Active', 
      type: 'boolean',
    },
    department: {
      label: 'Department',
      type: 'select',
      options: [
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Sales', label: 'Sales' },
        { value: 'HR', label: 'HR' },
        { value: 'Finance', label: 'Finance' },
      ]
    }
  }
};

const productMetadata: PaginatedListMetadata = {
  fields: {
    id: { label: 'ID', sortable: true, width: 80, align: 'center' },
    name: { label: 'Product Name', sortable: true },
    category: { label: 'Category', sortable: true },
    brand: { label: 'Brand', sortable: true },
    price: { 
      label: 'Price', 
      sortable: true, 
      type: 'number',
      align: 'right',
      format: (value) => `$${value.toFixed(2)}`
    },
    stock: { label: 'Stock', sortable: true, type: 'number', align: 'center' },
    rating: { 
      label: 'Rating', 
      sortable: true, 
      type: 'number',
      align: 'center',
      format: (value) => `⭐ ${value}`
    },
    inStock: { label: 'In Stock', type: 'boolean', align: 'center' },
  },
  operators: {
    equals: { label: 'Equals', type: 'text' },
    contains: { label: 'Contains', type: 'text' },
    priceRange: { label: 'Price Range', type: 'number' },
    category: {
      label: 'Category',
      type: 'select',
      options: [
        { value: 'Electronics', label: 'Electronics' },
        { value: 'Clothing', label: 'Clothing' },
        { value: 'Books', label: 'Books' },
        { value: 'Home & Garden', label: 'Home & Garden' },
        { value: 'Sports', label: 'Sports' },
      ]
    }
  }
};

const meta: Meta<typeof PaginatedList> = {
  title: 'Components/PaginatedList',
  component: PaginatedList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A comprehensive table component with metadata-driven headers, sorting, filtering, search, and pagination capabilities.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PaginatedList>;

// Sample data generators
const generateUsers = (count: number): UserData[] => {
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
  const statuses = ['Active', 'Inactive', 'Pending'];
  const roles = ['Admin', 'User', 'Manager', 'Viewer'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    department: departments[i % departments.length],
    status: statuses[i % statuses.length],
    role: roles[i % roles.length],
    salary: 50000 + (i * 1000) + Math.floor(Math.random() * 20000),
    joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
    isActive: Math.random() > 0.3,
  }));
};

const generateProducts = (count: number): ProductData[] => {
  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'];
  const brands = ['Brand A', 'Brand B', 'Brand C', 'Brand D'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    category: categories[i % categories.length],
    brand: brands[i % brands.length],
    price: Math.floor(Math.random() * 1000) + 10,
    stock: Math.floor(Math.random() * 100),
    rating: Math.round((Math.random() * 4 + 1) * 10) / 10,
    inStock: Math.random() > 0.2,
  }));
};

// Basic Examples
export const BasicTable: Story = {
  render: () => {
    const data = generateUsers(50);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    
    const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    
    return (
      <PaginatedList
        metadata={userMetadata}
        data={paginatedData}
        pagination={{
          page: currentPage,
          pageSize,
          total: data.length,
        }}
        onPageChange={(page) => setCurrentPage(page)}
      />
    );
  },
};

export const WithTitle: Story = {
  render: () => {
    const data = generateUsers(25);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    
    const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    
    return (
      <PaginatedList
        metadata={userMetadata}
        data={paginatedData}
        pagination={{
          page: currentPage,
          pageSize,
          total: data.length,
        }}
        title="Employee Directory"
        subtitle="Manage and view all employees in the system"
        onPageChange={(page) => setCurrentPage(page)}
      />
    );
  },
};

export const WithActions: Story = {
  render: () => {
    const data = generateUsers(20);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    
    const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    
    return (
      <PaginatedList
        metadata={userMetadata}
        data={paginatedData}
        pagination={{
          page: currentPage,
          pageSize,
          total: data.length,
        }}
        title="Users"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Export</Button>
            <Button size="sm">Add User</Button>
          </div>
        }
        onPageChange={(page) => setCurrentPage(page)}
      />
    );
  },
};

// Interactive Examples
export const WithSorting: Story = {
  render: () => {
    const [data, setData] = useState(() => generateUsers(30));
    const [currentPage, setCurrentPage] = useState(1);
    const [sort, setSort] = useState<SortConfig>();
    const pageSize = 8;
    
    const handleSort = (newSort: SortConfig) => {
      setSort(newSort);
      
      const sortedData = [...data].sort((a, b) => {
        const aVal = (a as any)[newSort.field];
        const bVal = (b as any)[newSort.field];
        
        if (aVal < bVal) return newSort.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return newSort.direction === 'asc' ? 1 : -1;
        return 0;
      });
      
      setData(sortedData);
      setCurrentPage(1);
    };
    
    const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    
    return (
      <PaginatedList
        metadata={userMetadata}
        data={paginatedData}
        pagination={{
          page: currentPage,
          pageSize,
          total: data.length,
        }}
        title="Sortable User List"
        onSort={handleSort}
        onPageChange={(page) => setCurrentPage(page)}
      />
    );
  },
};

export const WithSearch: Story = {
  render: () => {
    const allData = generateUsers(100);
    const [data, setData] = useState(allData);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    
    const handleSearch = (query: string) => {
      if (!query.trim()) {
        setData(allData);
      } else {
        const filtered = allData.filter(user => 
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase()) ||
          user.department.toLowerCase().includes(query.toLowerCase())
        );
        setData(filtered);
      }
      setCurrentPage(1);
    };
    
    const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    
    return (
      <PaginatedList
        metadata={userMetadata}
        data={paginatedData}
        pagination={{
          page: currentPage,
          pageSize,
          total: data.length,
        }}
        title="Searchable Users"
        showSearch
        searchPlaceholder="Search users by name, email, or department..."
        onSearch={handleSearch}
        onPageChange={(page) => setCurrentPage(page)}
      />
    );
  },
};

export const WithFilters: Story = {
  render: () => {
    const allData = generateUsers(80);
    const [data, setData] = useState(allData);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    
    const handleFilter = (filters: FilterConfig[]) => {
      let filtered = [...allData];
      
      filters.forEach(filter => {
        if (!filter.value) return;
        
        switch (filter.operator) {
          case 'equals':
            filtered = filtered.filter(item => (item as any)[filter.field] === filter.value);
            break;
          case 'contains':
            filtered = filtered.filter(item => 
              String((item as any)[filter.field]).toLowerCase().includes(String(filter.value).toLowerCase())
            );
            break;
          case 'department':
            filtered = filtered.filter(item => (item as any)[filter.field] === filter.value);
            break;
          case 'greaterThan':
            filtered = filtered.filter(item => Number((item as any)[filter.field]) > Number(filter.value));
            break;
          case 'lessThan':
            filtered = filtered.filter(item => Number((item as any)[filter.field]) < Number(filter.value));
            break;
          case 'isActive':
            filtered = filtered.filter(item => (item as UserData).isActive === filter.value);
            break;
        }
      });
      
      setData(filtered);
      setCurrentPage(1);
    };
    
    const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    
    return (
      <PaginatedList
        metadata={userMetadata}
        data={paginatedData}
        pagination={{
          page: currentPage,
          pageSize,
          total: data.length,
        }}
        title="Filterable Users"
        showFilters
        onFilter={handleFilter}
        onPageChange={(page) => setCurrentPage(page)}
      />
    );
  },
};

export const FullFeatures: Story = {
  render: () => {
    const allData = generateUsers(200);
    const [data, setData] = useState(allData);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sort, setSort] = useState<SortConfig>();
    const [loading, setLoading] = useState(false);
    
    const handleSearch = (query: string) => {
      setLoading(true);
      setTimeout(() => {
        if (!query.trim()) {
          setData(allData);
        } else {
          const filtered = allData.filter(user => 
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase()) ||
            user.department.toLowerCase().includes(query.toLowerCase())
          );
          setData(filtered);
        }
        setCurrentPage(1);
        setLoading(false);
      }, 500);
    };
    
    const handleFilter = (filters: FilterConfig[]) => {
      setLoading(true);
      setTimeout(() => {
        let filtered = [...allData];
        
        filters.forEach(filter => {
          if (!filter.value) return;
          
          switch (filter.operator) {
            case 'department':
              filtered = filtered.filter(item => (item as any)[filter.field] === filter.value);
              break;
            case 'contains':
              filtered = filtered.filter(item => 
                String((item as any)[filter.field]).toLowerCase().includes(String(filter.value).toLowerCase())
              );
              break;
            case 'greaterThan':
              filtered = filtered.filter(item => Number((item as any)[filter.field]) > Number(filter.value));
              break;
            case 'isActive':
              filtered = filtered.filter(item => (item as UserData).isActive === filter.value);
              break;
          }
        });
        
        setData(filtered);
        setCurrentPage(1);
        setLoading(false);
      }, 300);
    };
    
    const handleSort = (newSort: SortConfig) => {
      setLoading(true);
      setTimeout(() => {
        setSort(newSort);
        const sortedData = [...data].sort((a, b) => {
          const aVal = (a as any)[newSort.field];
          const bVal = (b as any)[newSort.field];
          
          if (aVal < bVal) return newSort.direction === 'asc' ? -1 : 1;
          if (aVal > bVal) return newSort.direction === 'asc' ? 1 : -1;
          return 0;
        });
        
        setData(sortedData);
        setLoading(false);
      }, 300);
    };
    
    const handlePageChange = (page: number, newPageSize: number) => {
      setLoading(true);
      setTimeout(() => {
        setCurrentPage(page);
        setPageSize(newPageSize);
        setLoading(false);
      }, 200);
    };
    
    const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    
    return (
      <PaginatedList
        metadata={userMetadata}
        data={paginatedData}
        pagination={{
          page: currentPage,
          pageSize,
          total: data.length,
          showSizeChanger: true,
        }}
        title="Complete User Management"
        subtitle="Search, filter, sort, and paginate through user data"
        showSearch
        showFilters
        loading={loading}
        searchPlaceholder="Search users..."
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
        onPageChange={handlePageChange}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Export CSV</Button>
            <Button variant="outline" size="sm">Import</Button>
            <Button size="sm">Add User</Button>
          </div>
        }
      />
    );
  },
};

// Different Data Types
export const ProductTable: Story = {
  render: () => {
    const data = generateProducts(45);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;
    
    const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    
    return (
      <PaginatedList
        metadata={productMetadata}
        data={paginatedData}
        pagination={{
          page: currentPage,
          pageSize,
          total: data.length,
        }}
        title="Product Catalog"
        subtitle="Browse our product inventory"
        showSearch
        onPageChange={(page) => setCurrentPage(page)}
      />
    );
  },
};

// Edge Cases
export const EmptyState: Story = {
  render: () => (
    <PaginatedList
      metadata={userMetadata}
      data={[]}
      pagination={{
        page: 1,
        pageSize: 10,
        total: 0,
      }}
      title="Empty Table"
      subtitle="No data to display"
      showSearch
      showFilters
    />
  ),
};

export const LoadingState: Story = {
  render: () => {
    const data = generateUsers(10);
    
    return (
      <PaginatedList
        metadata={userMetadata}
        data={data}
        pagination={{
          page: 1,
          pageSize: 10,
          total: 50,
        }}
        title="Loading Example"
        loading={true}
        showSearch
        showFilters
      />
    );
  },
};

export const SinglePage: Story = {
  render: () => {
    const data = generateUsers(5);
    
    return (
      <PaginatedList
        metadata={userMetadata}
        data={data}
        pagination={{
          page: 1,
          pageSize: 10,
          total: 5,
        }}
        title="Single Page"
        subtitle="All data fits on one page"
      />
    );
  },
}; 