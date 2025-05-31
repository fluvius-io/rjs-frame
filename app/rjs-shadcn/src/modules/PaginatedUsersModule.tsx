import { useState } from 'react';
import { PaginatedList, Button, type PaginatedListMetadata, type SortConfig, type FilterConfig } from 'rjs-admin';

// Data type definitions
interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  lastLogin: Date;
  isActive: boolean;
}

// Convert existing users data to the new format
const generateUsers = (): UserData[] => {
  const baseUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' as const, lastLogin: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' as const, lastLogin: '2024-01-14' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'Inactive' as const, lastLogin: '2024-01-10' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'Active' as const, lastLogin: '2024-01-13' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin', status: 'Active' as const, lastLogin: '2024-01-15' },
    { id: 6, name: 'Diana Davis', email: 'diana@example.com', role: 'Editor', status: 'Active' as const, lastLogin: '2024-01-12' },
    { id: 7, name: 'Eve Miller', email: 'eve@example.com', role: 'User', status: 'Inactive' as const, lastLogin: '2024-01-08' },
    { id: 8, name: 'Frank Garcia', email: 'frank@example.com', role: 'User', status: 'Active' as const, lastLogin: '2024-01-14' },
    { id: 9, name: 'Grace Lee', email: 'grace@example.com', role: 'Editor', status: 'Active' as const, lastLogin: '2024-01-11' },
    { id: 10, name: 'Henry Taylor', email: 'henry@example.com', role: 'Admin', status: 'Active' as const, lastLogin: '2024-01-15' },
    { id: 11, name: 'Ivy Anderson', email: 'ivy@example.com', role: 'User', status: 'Active' as const, lastLogin: '2024-01-13' },
    { id: 12, name: 'Jack Thomas', email: 'jack@example.com', role: 'User', status: 'Inactive' as const, lastLogin: '2024-01-09' },
  ];

  return baseUsers.map(user => ({
    ...user,
    lastLogin: new Date(user.lastLogin),
    isActive: user.status === 'Active',
  }));
};

// Metadata configuration for the user table
const userMetadata: PaginatedListMetadata = {
  fields: {
    id: { label: 'ID', sortable: true, width: 80, align: 'center' },
    name: { label: 'Name', sortable: true },
    email: { label: 'Email', sortable: true },
    role: { 
      label: 'Role', 
      sortable: true,
      format: (value: string) => {
        const roleColors = {
          'Admin': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
          'Editor': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
          'User': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[value as keyof typeof roleColors]}`}>
            {value}
          </span>
        );
      }
    },
    status: { 
      label: 'Status', 
      sortable: true,
      format: (value: string) => {
        const statusColor = value === 'Active'
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {value}
          </span>
        );
      }
    },
    lastLogin: { 
      label: 'Last Login', 
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
    role: {
      label: 'Role',
      type: 'select',
      options: [
        { value: 'Admin', label: 'Admin' },
        { value: 'Editor', label: 'Editor' },
        { value: 'User', label: 'User' },
      ]
    },
    status: {
      label: 'Status',
      type: 'select',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
      ]
    },
    isActive: { 
      label: 'Is Active', 
      type: 'boolean',
    },
  }
};

export function PaginatedUsersComponent() {
  const allData = generateUsers();
  const [data, setData] = useState(allData);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
          user.role.toLowerCase().includes(query.toLowerCase())
        );
        setData(filtered);
      }
      setCurrentPage(1);
      setLoading(false);
    }, 300);
  };

  const handleFilter = (filters: FilterConfig[]) => {
    setLoading(true);
    setTimeout(() => {
      let filtered = [...allData];
      
      filters.forEach(filter => {
        if (!filter.value) return;
        
        switch (filter.operator) {
          case 'role':
            filtered = filtered.filter(item => (item as any)[filter.field] === filter.value);
            break;
          case 'status':
            filtered = filtered.filter(item => (item as any)[filter.field] === filter.value);
            break;
          case 'contains':
            filtered = filtered.filter(item => 
              String((item as any)[filter.field]).toLowerCase().includes(String(filter.value).toLowerCase())
            );
            break;
          case 'equals':
            filtered = filtered.filter(item => (item as any)[filter.field] === filter.value);
            break;
          case 'startsWith':
            filtered = filtered.filter(item => 
              String((item as any)[filter.field]).toLowerCase().startsWith(String(filter.value).toLowerCase())
            );
            break;
          case 'isActive':
            filtered = filtered.filter(item => (item as UserData).isActive === filter.value);
            break;
        }
      });
      
      setData(filtered);
      setCurrentPage(1);
      setLoading(false);
    }, 200);
  };

  const handleSort = (newSort: SortConfig) => {
    setLoading(true);
    setTimeout(() => {
      const sortedData = [...data].sort((a, b) => {
        const aVal = (a as any)[newSort.field];
        const bVal = (b as any)[newSort.field];
        
        if (aVal < bVal) return newSort.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return newSort.direction === 'asc' ? 1 : -1;
        return 0;
      });
      
      setData(sortedData);
      setLoading(false);
    }, 200);
  };

  const handlePageChange = (page: number, newPageSize: number) => {
    setLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setPageSize(newPageSize);
      setLoading(false);
    }, 100);
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
      title="User Management"
      subtitle="Manage and view all users in the system"
      showSearch
      showFilters
      loading={loading}
      searchPlaceholder="Search users by name, email, or role..."
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
} 