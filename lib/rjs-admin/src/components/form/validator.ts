import Ajv, { JSONSchemaType } from "ajv";
import addFormats from "ajv-formats";

export class JSONSchemaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JSONSchemaError";
  }
}

export class JSONValidatorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JSONValidatorError";
  }
}

const ajv = new Ajv({
  allErrors: true,
  useDefaults: true,
  keywords: ["uniforms"],
});

// Add format validation support (email, date, time, uri, etc.)
addFormats(ajv);

/**
 * Creates a validator function for JSON Schema validation using AJV.
 *
 * This function compiles a JSON Schema into a validator function that can be used
 * with uniforms. It uses AJV (Another JSON Schema Validator) for comprehensive
 * validation with support for all JSON Schema features.
 *
 * @param schema - JSON Schema object to validate against
 * @returns A validator function that takes a model object and returns validation errors or null
 *
 * @example
 * ```typescript
 * const schema = {
 *   type: "object",
 *   properties: {
 *     name: { type: "string", minLength: 1 },
 *     email: { type: "string", format: "email" }
 *   },
 *   required: ["name", "email"]
 * };
 *
 * const validator = createValidator(schema);
 * const errors = validator({ name: "", email: "invalid" });
 * // Returns: { details: [...] } with AJV error objects
 * ```
 */
export function createValidator<T>(schema: JSONSchemaType<T>) {
  const validatedSchema = validateJSONSchema<T>(schema);
  try {
    const validator = ajv.compile(validatedSchema);

    return (model: Record<string, unknown>) => {
      const isValid = validator(model);
      return !isValid && validator.errors?.length
        ? { details: validator.errors }
        : null;
    };
  } catch (error) {
    throw new JSONValidatorError("Error: Invalid schema provided to JSONForm");
  }
}

const validateJSONSchema = <T>(schema: JSONSchemaType<T>) => {
  // Validate schema more thoroughly
  if (typeof schema !== "object" || Array.isArray(schema)) {
    throw new JSONSchemaError("Error: Invalid schema provided to JSONForm");
  }

  // Ensure schema has required properties for JSON Schema
  if (!schema.type) {
    throw new JSONSchemaError("Error: Schema must have a 'type' property");
  }

  if (schema.type !== "object") {
    throw new JSONSchemaError("Error: Schema type must be 'object'");
  }

  if (!schema.properties || typeof schema.properties !== "object") {
    throw new JSONSchemaError("Error: Schema must have a 'properties' object");
  }

  return schema;
};
