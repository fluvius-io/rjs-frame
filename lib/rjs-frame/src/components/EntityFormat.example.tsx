import React from "react";
import { EntityFormat } from "./EntityFormat";

/**
 * EntityFormat Usage Examples
 * Demonstrates different ways to use the EntityFormat component
 */

// Basic usage example
export const BasicEntityExample: React.FC = () => (
  <div>
    <h2>Basic Entity Format</h2>
    <EntityFormat _id="user123" apiName="users" />
  </div>
);

// Custom rendering example
export const CustomEntityExample: React.FC = () => (
  <div>
    <h2>Custom Rendered Entity</h2>
    <EntityFormat
      _id="product456"
      apiName="products"
      renderEntity={(product) => (
        <div
          style={{
            border: "1px solid #ddd",
            padding: "16px",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3>{product.name}</h3>
          <p>
            <strong>Price:</strong> ${product.price}
          </p>
          <p>
            <strong>Description:</strong> {product.description}
          </p>
          <p>
            <strong>In Stock:</strong> {product.inStock ? "Yes" : "No"}
          </p>
        </div>
      )}
    />
  </div>
);

// With collection name example
export const CollectionEntityExample: React.FC = () => (
  <div>
    <h2>Entity from Specific Collection</h2>
    <EntityFormat _id="order789" apiName="EcommerceAPI:orders" />
  </div>
);

// With custom loading and error components
export const CustomStatesExample: React.FC = () => (
  <div>
    <h2>Custom Loading & Error States</h2>
    <EntityFormat
      _id="profile123"
      apiName="profiles"
      loadingComponent={
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            backgroundColor: "#f0f8ff",
            borderRadius: "4px",
          }}
        >
          🔄 Fetching profile data...
        </div>
      }
      errorComponent={
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            backgroundColor: "#ffe6e6",
            borderRadius: "4px",
            color: "#d32f2f",
          }}
        >
          ❌ Failed to load profile. Please try again.
        </div>
      }
      onLoad={(data) => console.log("Profile loaded:", data)}
      onError={(error) => console.error("Profile error:", error)}
    />
  </div>
);

// Card-style example
export const CardEntityExample: React.FC = () => (
  <div>
    <h2>Card Style Entity</h2>
    <EntityFormat
      _id="employee456"
      apiName="employees"
      className="custom-card"
      renderEntity={(employee) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            border: "1px solid #e0e0e0",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "#007bff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            {employee.firstName?.[0]}
            {employee.lastName?.[0]}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>
              {employee.firstName} {employee.lastName}
            </h3>
            <p style={{ margin: "0 0 4px 0", color: "#666" }}>
              {employee.title}
            </p>
            <p style={{ margin: "0", color: "#888", fontSize: "14px" }}>
              {employee.department}
            </p>
          </div>
          <div style={{ color: "#007bff", fontSize: "14px" }}>
            ID: {employee.id}
          </div>
        </div>
      )}
    />
  </div>
);

// All examples combined
export const EntityFormatExamples: React.FC = () => (
  <div
    style={{
      padding: "20px",
      maxWidth: "800px",
      margin: "0 auto",
      fontFamily: "Arial, sans-serif",
    }}
  >
    <h1>EntityFormat Component Examples</h1>

    <div style={{ marginBottom: "40px" }}>
      <BasicEntityExample />
    </div>

    <div style={{ marginBottom: "40px" }}>
      <CustomEntityExample />
    </div>

    <div style={{ marginBottom: "40px" }}>
      <CollectionEntityExample />
    </div>

    <div style={{ marginBottom: "40px" }}>
      <CustomStatesExample />
    </div>

    <div style={{ marginBottom: "40px" }}>
      <CardEntityExample />
    </div>
  </div>
);

export default EntityFormatExamples;
