import React, { useState } from "react";
import { Button, JSONForm, createValidator } from "rjs-admin";

// Example JSON Schema for a user form
const userSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      title: "Full Name",
      description: "Enter your full name",
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: "string",
      title: "Email Address",
      description: "Enter a valid email address",
      format: "email",
      pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
    },
    age: {
      type: "integer",
      title: "Age",
      description: "Your age in years",
      minimum: 18,
      maximum: 120,
    },
    role: {
      type: "string",
      title: "Role",
      description: "Select your role",
      enum: ["admin", "user", "moderator", "guest"],
    },
    bio: {
      type: "string",
      title: "Biography",
      description: "Tell us about yourself",
      maxLength: 500,
    },
    isActive: {
      type: "boolean",
      title: "Active Status",
      description: "Whether this user is active",
    },
  },
  required: ["name", "email", "role"],
} as const;

// Create a validator using the createValidator function
const userValidator = createValidator(userSchema);

// Example JSON Schema for a product form
const productSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      title: "Product Title",
      description: "Enter the product name",
      minLength: 1,
      maxLength: 100,
    },
    price: {
      type: "number",
      title: "Price",
      description: "Product price in dollars",
      minimum: 0,
    },
    category: {
      type: "string",
      title: "Category",
      description: "Select product category",
      enum: ["electronics", "clothing", "books", "home", "sports"],
    },
    description: {
      type: "string",
      title: "Description",
      description: "Product description",
      maxLength: 1000,
    },
    inStock: {
      type: "boolean",
      title: "In Stock",
      description: "Whether the product is currently in stock",
    },
  },
  required: ["title", "price", "category"],
};

export function JSONFormExample() {
  const [showUserModal, setShowUserModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [validationResult, setValidationResult] = useState<any>(null);

  const handleUserSubmit = (data: any) => {
    console.log("User form submitted:", data);
    setFormData(data);
    setShowUserModal(false);
  };

  const handleProductSubmit = (data: any) => {
    console.log("Product form submitted:", data);
    setFormData(data);
    setShowProductModal(false);
  };

  const handleValidateManually = () => {
    // Example of using the validator independently
    const testData = {
      name: "J", // Too short (minLength: 2)
      email: "invalid-email", // Invalid format
      age: 15, // Too young (minimum: 18)
      // role missing (required field)
    };

    const errors = userValidator(testData);
    setValidationResult({ testData, errors });
  };

  const topContent = (
    <div className="bg-blue-50 p-3 rounded-md">
      <p className="text-sm text-blue-700">
        This is custom content at the top of the form. You can add any React
        components here.
      </p>
    </div>
  );

  const bottomContent = (
    <div className="bg-gray-50 p-3 rounded-md">
      <p className="text-sm text-gray-600">
        This is custom content at the bottom of the form. You can add additional
        information or actions here.
      </p>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">JSONForm Examples (Uniforms-based)</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Form - Inline */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">User Form (Inline)</h2>
          <JSONForm
            schema={userSchema}
            onSubmit={handleUserSubmit}
            onCancel={() => console.log("User form cancelled")}
            title="User Registration"
            topContent={topContent}
            bottomContent={bottomContent}
            validate="onChange"
            showInlineError={true}
          />
        </div>

        {/* Product Form - Inline */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Product Form (Inline)</h2>
          <JSONForm
            schema={productSchema}
            onSubmit={handleProductSubmit}
            onCancel={() => console.log("Product form cancelled")}
            title="Add Product"
          />
        </div>
      </div>

      {/* Modal Triggers */}
      <div className="flex gap-4">
        <Button onClick={() => setShowUserModal(true)}>
          Open User Form Modal
        </Button>
        <Button onClick={() => setShowProductModal(true)}>
          Open Product Form Modal
        </Button>
      </div>

      {/* Modal Forms */}
      <JSONForm
        schema={userSchema}
        modal={true}
        open={showUserModal}
        onOpenChange={setShowUserModal}
        onSubmit={handleUserSubmit}
        onCancel={() => setShowUserModal(false)}
        title="User Registration"
        topContent={topContent}
        bottomContent={bottomContent}
        validate="onChange"
        showInlineError={true}
      />

      <JSONForm
        schema={productSchema}
        modal={true}
        open={showProductModal}
        onOpenChange={setShowProductModal}
        onSubmit={handleProductSubmit}
        onCancel={() => setShowProductModal(false)}
        title="Add Product"
      />

      {/* Manual Validation Example */}
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          Manual Validation Example
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          You can also use the createValidator function independently:
        </p>

        <button
          onClick={handleValidateManually}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
        >
          Test Manual Validation
        </button>

        {validationResult && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Test Data:</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                {JSON.stringify(validationResult.testData, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="font-medium mb-2">Validation Result:</h3>
              <pre className="bg-red-50 p-3 rounded text-sm overflow-auto">
                {JSON.stringify(validationResult.errors, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Display submitted data */}
      {formData && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">Submitted Data:</h3>
          <pre className="text-sm text-green-700 overflow-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default JSONFormExample;
