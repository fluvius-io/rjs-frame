import React from "react";
import { EntityFormat } from "../src/components/entity/EntityFormat";

/**
 * EntityFormat Usage Examples
 * Demonstrates different ways to use the EntityFormat component with the updated APIManager
 */

// Basic usage example with new API name format
export const BasicEntityExample: React.FC = () => (
  <div>
    <h2>Basic Entity Format</h2>
    <EntityFormat itemId="user123" apiName="idm:user" />
  </div>
);

// Example with collection:queryName format
export const CollectionEntityExample: React.FC = () => (
  <div>
    <h2>Collection-based Entity</h2>
    <EntityFormat itemId="org456" apiName="idm:organization" />
  </div>
);

// Example with additional parameters
export const EntityWithParamsExample: React.FC = () => (
  <div>
    <h2>Entity with Parameters</h2>
    <EntityFormat
      itemId="user123"
      apiName="idm:user"
      params={{
        cache: false,
        headers: {
          "X-Custom-Header": "value",
        },
      }}
    />
  </div>
);

// Custom rendering example
export const CustomEntityExample: React.FC = () => (
  <div>
    <h2>Custom Rendered Entity</h2>
    <EntityFormat
      itemId="product456"
      apiName="shop:product"
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

// With custom loading and error components
export const CustomStatesExample: React.FC = () => (
  <div>
    <h2>Custom Loading & Error States</h2>
    <EntityFormat
      itemId="profile123"
      apiName="idm:profile"
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
      itemId="employee456"
      apiName="hr:employee"
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

// Example showing different API name formats
export const ApiNameFormatsExample: React.FC = () => (
  <div>
    <h2>Different API Name Formats</h2>

    <div style={{ marginBottom: "20px" }}>
      <h3>Collection:QueryName format</h3>
      <EntityFormat itemId="user123" apiName="idm:user" />
    </div>

    <div style={{ marginBottom: "20px" }}>
      <h3>Simple query name (uses default collection)</h3>
      <EntityFormat itemId="user456" apiName="user" />
    </div>

    <div style={{ marginBottom: "20px" }}>
      <h3>Different collection</h3>
      <EntityFormat itemId="org789" apiName="shop:organization" />
    </div>
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
    <p style={{ color: "#666", marginBottom: "20px" }}>
      Updated for the new APIManager with collection routing support
    </p>

    <div style={{ marginBottom: "40px" }}>
      <BasicEntityExample />
    </div>

    <div style={{ marginBottom: "40px" }}>
      <CollectionEntityExample />
    </div>

    <div style={{ marginBottom: "40px" }}>
      <EntityWithParamsExample />
    </div>

    <div style={{ marginBottom: "40px" }}>
      <CustomEntityExample />
    </div>

    <div style={{ marginBottom: "40px" }}>
      <CustomStatesExample />
    </div>

    <div style={{ marginBottom: "40px" }}>
      <CardEntityExample />
    </div>

    <div style={{ marginBottom: "40px" }}>
      <ApiNameFormatsExample />
    </div>
  </div>
);

export default EntityFormatExamples;
