import React from "react";
import { MockAPI } from "../src/api";
import { ItemFetcher, useItemContext } from "../src/components/ItemFetcher";

// Sample data
const sampleUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "active",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Editor",
    status: "inactive",
  },
];

// Register mock data
MockAPI.registerQuery("users", sampleUsers);

// Component that uses the item context
const UserDetails: React.FC = () => {
  const { data, loading, error, refetch } = useItemContext();

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">Error loading user</h3>
          <p className="text-red-600 text-sm mt-1">{error.message}</p>
          <button
            onClick={refetch}
            className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4">
        <p className="text-gray-500">No user selected</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          User Details
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <p className="mt-1 text-sm text-gray-900">{data.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <p className="mt-1 text-sm text-gray-900">{data.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <p className="mt-1 text-sm text-gray-900">{data.role}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                data.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {data.status}
            </span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={refetch}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

// Example usage component
export const ItemFetcherExample: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        ItemFetcher Example
      </h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          How it works:
        </h2>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>
            ItemFetcher monitors pageParams for a specific key (e.g., "user")
          </li>
          <li>
            When the param value changes, it automatically fetches the item
            using APIManager
          </li>
          <li>The fetched data is provided through ItemContext</li>
          <li>
            Child components can access the data using useItemContext hook
          </li>
        </ul>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-md font-medium text-gray-800 mb-3">
          Current pageParams.user value: (simulated)
        </h3>
        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-600">
            This example simulates different user IDs. In a real app, these
            would come from URL parameters.
          </p>
        </div>
      </div>

      {/* ItemFetcher wraps the component that needs the data */}
      <ItemFetcher paramKey="user" apiName="users">
        <UserDetails />
      </ItemFetcher>
    </div>
  );
};

export default ItemFetcherExample;
