import { useState } from "react";
import {
  Button,
  DataTable,
  type FilterConfig,
  type SortConfig,
} from "rjs-admin";

// Local interface definition for QueryMetadata
interface QueryMetadata {
  fields: Record<
    string,
    {
      label: string;
      sortable: boolean;
      hidden: boolean;
      identifier: boolean;
      factory: string | null;
      source: string | null;
    }
  >;
  operators: Record<
    string,
    {
      index: number;
      field_name: string;
      operator: string;
      widget: {
        name: string;
        desc: string | null;
        inversible: boolean;
        data_query: any | null;
      } | null;
    }
  >;
  sortables: string[];
  default_order: string[];
}

// Data type definitions
interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  lastLogin: Date;
  isActive: boolean;
}

// Convert existing users data to the new format
const generateUsers = (): UserData[] => {
  const baseUsers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active" as const,
      lastLogin: "2024-01-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "User",
      status: "Active" as const,
      lastLogin: "2024-01-14",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "Editor",
      status: "Inactive" as const,
      lastLogin: "2024-01-10",
    },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice@example.com",
      role: "User",
      status: "Active" as const,
      lastLogin: "2024-01-13",
    },
    {
      id: 5,
      name: "Charlie Wilson",
      email: "charlie@example.com",
      role: "Admin",
      status: "Active" as const,
      lastLogin: "2024-01-15",
    },
    {
      id: 6,
      name: "Diana Davis",
      email: "diana@example.com",
      role: "Editor",
      status: "Active" as const,
      lastLogin: "2024-01-12",
    },
    {
      id: 7,
      name: "Eve Miller",
      email: "eve@example.com",
      role: "User",
      status: "Inactive" as const,
      lastLogin: "2024-01-08",
    },
    {
      id: 8,
      name: "Frank Garcia",
      email: "frank@example.com",
      role: "User",
      status: "Active" as const,
      lastLogin: "2024-01-14",
    },
    {
      id: 9,
      name: "Grace Lee",
      email: "grace@example.com",
      role: "Editor",
      status: "Active" as const,
      lastLogin: "2024-01-11",
    },
    {
      id: 10,
      name: "Henry Taylor",
      email: "henry@example.com",
      role: "Admin",
      status: "Active" as const,
      lastLogin: "2024-01-15",
    },
    {
      id: 11,
      name: "Ivy Anderson",
      email: "ivy@example.com",
      role: "User",
      status: "Active" as const,
      lastLogin: "2024-01-13",
    },
    {
      id: 12,
      name: "Jack Thomas",
      email: "jack@example.com",
      role: "User",
      status: "Inactive" as const,
      lastLogin: "2024-01-09",
    },
  ];

  return baseUsers.map((user) => ({
    ...user,
    lastLogin: new Date(user.lastLogin),
    isActive: user.status === "Active",
  }));
};

// Metadata configuration for the user table
const userMetadata: QueryMetadata = {
  fields: {
    id: {
      label: "ID",
      sortable: true,
      hidden: false,
      identifier: true,
      factory: null,
      source: null,
    },
    name: {
      label: "Name",
      sortable: true,
      hidden: false,
      identifier: false,
      factory: null,
      source: null,
    },
    email: {
      label: "Email",
      sortable: true,
      hidden: false,
      identifier: false,
      factory: null,
      source: null,
    },
    role: {
      label: "Role",
      sortable: true,
      hidden: false,
      identifier: false,
      factory: null,
      source: null,
    },
    status: {
      label: "Status",
      sortable: true,
      hidden: false,
      identifier: false,
      factory: null,
      source: null,
    },
    lastLogin: {
      label: "Last Login",
      sortable: true,
      hidden: false,
      identifier: false,
      factory: null,
      source: null,
    },
    isActive: {
      label: "Active",
      sortable: true,
      hidden: false,
      identifier: false,
      factory: null,
      source: null,
    },
  },
  operators: {
    equals: {
      index: 0,
      field_name: "equals",
      operator: "equals",
      widget: {
        name: "text",
        desc: "Equals",
        inversible: false,
        data_query: null,
      },
    },
    contains: {
      index: 1,
      field_name: "contains",
      operator: "contains",
      widget: {
        name: "text",
        desc: "Contains",
        inversible: false,
        data_query: null,
      },
    },
    startsWith: {
      index: 2,
      field_name: "startsWith",
      operator: "startsWith",
      widget: {
        name: "text",
        desc: "Starts with",
        inversible: false,
        data_query: null,
      },
    },
    role: {
      index: 3,
      field_name: "role",
      operator: "role",
      widget: {
        name: "select",
        desc: "Role",
        inversible: false,
        data_query: {
          options: [
            { value: "Admin", label: "Admin" },
            { value: "Editor", label: "Editor" },
            { value: "User", label: "User" },
          ],
        },
      },
    },
    status: {
      index: 4,
      field_name: "status",
      operator: "status",
      widget: {
        name: "select",
        desc: "Status",
        inversible: false,
        data_query: {
          options: [
            { value: "Active", label: "Active" },
            { value: "Inactive", label: "Inactive" },
          ],
        },
      },
    },
    isActive: {
      index: 5,
      field_name: "isActive",
      operator: "isActive",
      widget: {
        name: "boolean",
        desc: "Is Active",
        inversible: false,
        data_query: null,
      },
    },
  },
  sortables: ["id", "name", "email", "role", "status", "lastLogin", "isActive"],
  default_order: ["id"],
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
        const filtered = allData.filter(
          (user) =>
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

      filters.forEach((filter) => {
        if (!filter.value) return;

        switch (filter.operator) {
          case "role":
            filtered = filtered.filter(
              (item) => (item as any)[filter.field] === filter.value
            );
            break;
          case "status":
            filtered = filtered.filter(
              (item) => (item as any)[filter.field] === filter.value
            );
            break;
          case "contains":
            filtered = filtered.filter((item) =>
              String((item as any)[filter.field])
                .toLowerCase()
                .includes(String(filter.value).toLowerCase())
            );
            break;
          case "equals":
            filtered = filtered.filter(
              (item) => (item as any)[filter.field] === filter.value
            );
            break;
          case "startsWith":
            filtered = filtered.filter((item) =>
              String((item as any)[filter.field])
                .toLowerCase()
                .startsWith(String(filter.value).toLowerCase())
            );
            break;
          case "isActive":
            filtered = filtered.filter(
              (item) => (item as UserData).isActive === filter.value
            );
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

        if (aVal < bVal) return newSort.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return newSort.direction === "asc" ? 1 : -1;
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

  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <DataTable
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
      onQueryChange={(query) => {
        if (query.searchQuery) {
          handleSearch(query.searchQuery);
        }
        if (query.query) {
          // Parse the query string and convert to FilterConfig[]
          try {
            const queryObj = JSON.parse(query.query);
            const filters: FilterConfig[] = Object.entries(queryObj).map(
              ([key, value]) => {
                const [field, operator] = key.split(":");
                return { field, operator, value };
              }
            );
            handleFilter(filters);
          } catch (error) {
            console.warn("Failed to parse query:", error);
          }
        }
        if (query.sort && query.sort.length > 0) {
          const [field, direction] = query.sort[0].split(":");
          handleSort({ field, direction: direction as "asc" | "desc" });
        }
      }}
      onPageChange={handlePageChange}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Export CSV
          </Button>
          <Button variant="outline" size="sm">
            Import
          </Button>
          <Button size="sm">Add User</Button>
        </div>
      }
    />
  );
}
