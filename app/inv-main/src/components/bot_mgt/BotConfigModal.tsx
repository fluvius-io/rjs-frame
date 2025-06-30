import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDown, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "rjs-admin";
import { APIManager } from "rjs-frame";

interface BotDefinition {
  name: string;
  key: string;
  description: string;
  params: Record<string, any>;
}

interface BotConfigModalProps {
  open: boolean;
  onClose: (params: Record<string, any>) => void;
  botDefId: string;
  onRun: () => void;
}

interface MetadataInput {
  type: string;
  data: any;
  display?: string[];
  actual?: string;
}

interface FieldMetadata {
  input: MetadataInput;
}

function isObjectSchema(def: any): def is { [key: string]: any } {
  return typeof def === "object" && def !== null && !Array.isArray(def);
}

interface SearchableSelectProps {
  value: string;
  placeholder: string;
  resource: string;
  select?: string[];
  displayFields: string[];
  actualField: string;
  required?: boolean;
  error?: boolean;
  onChange: (value: string) => void;
  onSelect: (option: any) => void;
}

const SearchableSelect = ({
  value,
  onChange,
  placeholder,
  resource,
  select,
  displayFields,
  actualField,
  onSelect,
  required,
  error,
}: SearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any>(null);

  const searchOptions = async (search: string) => {
    if (!search.trim()) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await APIManager.query(resource, {
        search: {
          limit: 10,
          page: 1,
          offset: 0,
          text: search,
        },
        select: select || ["*"],
      });
      setOptions(response.data || []);
    } catch (error) {
      console.error("Failed to fetch options:", error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        searchOptions(searchTerm);
      } else {
        setOptions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, resource, select]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;
    setSearchTerm(search);
    onChange(search);
  };

  const handleOptionSelect = (option: any) => {
    const displayValue = displayFields
      .map((field) => option[field])
      .join(" - ");
    const actualValue = option[actualField];

    setSelectedOption(option);
    setSearchTerm(displayValue);
    onChange(actualValue);
    setIsOpen(false);
    onSelect(option);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (!searchTerm && !selectedOption) {
      searchOptions("");
    }
  };

  const handleInputBlur = () => {
    // Delay closing to allow for option selection
    setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md pr-10 ${
            error ? "border-red-500" : "border-gray-300"
          } ${required && !value ? "border-red-500" : ""}`}
        />
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="px-3 py-2 text-sm text-gray-500">Loading...</div>
          ) : options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              {searchTerm ? "No results found" : "Start typing to search..."}
            </div>
          ) : (
            options.map((option, index) => {
              const displayValue = displayFields
                .map((field) => option[field])
                .join(" - ");
              return (
                <div
                  key={index}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleOptionSelect(option)}
                >
                  {displayValue}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export function BotConfigModal({
  open,
  onClose,
  botDefId,
  onRun,
}: BotConfigModalProps) {
  const [botDef, setBotDef] = useState<BotDefinition | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isRunning, setIsRunning] = useState(false);
  const [runError, setRunError] = useState("");

  useEffect(() => {
    if (!open || !botDefId) return;
    setLoading(true);
    setError("");
    setBotDef(null);
    setFormData({});
    setValidationErrors({});
    setRunError("");
    APIManager.queryItem("trade-bot:bot-definition", botDefId, { cache: true })
      .then((response: { data: BotDefinition }) => {
        setBotDef(response.data);
      })
      .catch(() => setError("Failed to load bot definition."))
      .finally(() => setLoading(false));
  }, [open, botDefId]);

  const validateForm = (): boolean => {
    if (!botDef?.params?.properties) return true;

    const errors: Record<string, string> = {};
    const requiredFields = botDef.params.required || [];

    // Check required fields
    requiredFields.forEach((fieldName: string) => {
      const value = formData[fieldName];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        errors[fieldName] = `${fieldName} is required`;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsRunning(true);
    setRunError("");

    try {
      // Call the trade-bot:create-bot API
      const data = {
        name: "default",
        bot_def_id: botDefId,
        params: formData,
      };
      let response: any;
      try {
        response = await APIManager.send("trade-bot:create-bot", data, {
          path: { resource: "bot", _id: ":new" },
        });
      } catch (error: any) {
        console.error("Failed to create bot:", error);
        setRunError(error.message || "Failed to create bot. Please try again.");
      }

      console.log("Bot created successfully:", response);

      // Call the onRun callback with the response data
      onRun();

      // Close the modal
      onClose({
        success: true,
        data: response.data,
        params: formData,
      });
    } catch (error: any) {
      console.error("Failed to create bot:", error);
      setRunError(error.message || "Failed to create bot. Please try again.");
    } finally {
      setIsRunning(false);
    }
  };

  const renderInputField = (key: string, prop: any) => {
    const isRequired = botDef?.params?.required?.includes(key);
    const fieldError = validationErrors[key];

    // Check for metadata-based select
    if (isObjectSchema(prop) && prop.metadata !== undefined) {
      const metadata = prop.metadata as FieldMetadata;
      const { type, data, display, actual } = metadata.input;

      // API-based select with search
      if (type == "api") {
        const displayFields = display || ["name"];
        const actualField = actual || "id";

        return (
          <div>
            <SearchableSelect
              value={formData[key] || ""}
              onChange={(value) => setFormData({ ...formData, [key]: value })}
              placeholder={`Search ${key}...`}
              resource={data.resource}
              select={data.select}
              displayFields={displayFields}
              actualField={actualField}
              required={isRequired}
              error={!!fieldError}
              onSelect={(option) => {
                // Additional handling if needed
                console.log("Selected option:", option);
              }}
            />
            {fieldError && (
              <div className="text-red-500 text-xs mt-1">{fieldError}</div>
            )}
          </div>
        );
      }

      // Enum-based select with metadata
      if (type == "fixture") {
        return (
          <div>
            <select
              value={formData[key] || ""}
              onChange={(e) => {
                setFormData({ ...formData, [key]: e.target.value });
              }}
              className={cn(
                "w-full px-2 py-2 border rounded-md",
                fieldError ? "border-red-500" : "border-gray-300",
                isRequired && !formData[key] ? "border-red-500" : "",
                formData[key] ? "" : "text-gray-400"
              )}
            >
              <option value="" disabled selected hidden>
                Select {key}
              </option>
              {data.map((option: any, index: number) => (
                <option key={index} value={option.key}>
                  {option.key} - {option.display}
                </option>
              ))}
            </select>
            {fieldError && (
              <div className="text-red-500 text-xs mt-1">{fieldError}</div>
            )}
          </div>
        );
      }
    }

    // Fallback to existing enum logic
    if (
      isObjectSchema(prop) &&
      prop.type === "string" &&
      Array.isArray(prop.enum) &&
      prop.enum.every((v) => typeof v === "string")
    ) {
      return (
        <div>
          <select
            value={formData[key] || ""}
            onChange={(e) =>
              setFormData({ ...formData, [key]: e.target.value })
            }
            className={`w-full px-3 py-2 border rounded-md ${
              fieldError ? "border-red-500" : "border-gray-300"
            } ${isRequired && !formData[key] ? "border-red-500" : ""}`}
          >
            <option value="" disabled selected hidden>
              Select {key}
            </option>
            {(prop.enum as string[]).map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          {fieldError && (
            <div className="text-red-500 text-xs mt-1">{fieldError}</div>
          )}
        </div>
      );
    }

    // Default text input
    return (
      <div>
        <input
          type="text"
          placeholder={`Input ${key}. e.g. ${
            isObjectSchema(prop) &&
            prop.examples &&
            Array.isArray(prop.examples) &&
            prop.examples.length > 0
              ? prop.examples[0]
              : ""
          }`}
          value={formData[key] || ""}
          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
          className={`w-full px-3 py-2 border rounded-md ${
            fieldError ? "border-red-500" : "border-gray-300"
          } ${isRequired && !formData[key] ? "border-red-500" : ""}`}
        />
        {fieldError && (
          <div className="text-red-500 text-xs mt-1">{fieldError}</div>
        )}
      </div>
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={() => onClose({ open: false })}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content
          className="
            fixed z-50 left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2
            rounded-lg bg-white shadow-lg p-0 focus:outline-none
            transition-all duration-300
            data-[state=open]:opacity-100 data-[state=open]:scale-100
            data-[state=closed]:opacity-0 data-[state=closed]:scale-95
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-violet-700 rounded-t-lg">
            <Dialog.Title className="text-lg font-semibold text-white">
              Fill Parameters & Run Bot
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-white hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>
          {/* Loading/Error */}
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : botDef ? (
            <>
              {/* Bot Info */}
              <div className="p-4">
                <div className="p-4 bg-violet-50 rounded-b-lg text-md">
                  <div className="pb-2">
                    <span className="font-bold">Bot name:</span> {botDef.name}
                  </div>
                  <div className="pb-2">
                    <span className="font-bold">Key:</span> {botDef.key}
                  </div>
                  <div className="pb-2">
                    <span className="font-bold">Description:</span>{" "}
                    {botDef.description}
                  </div>
                </div>
              </div>
              {/* Form */}
              <div className="p-4 pt-0">
                <p className="mb-2 text-sm text-gray-700">
                  Fill in the required parameters to run the bot.
                </p>

                {/* Run Error */}
                {runError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <div className="text-red-800 text-sm font-medium">
                      Failed to create bot
                    </div>
                    <div className="text-red-700 text-sm mt-1">{runError}</div>
                  </div>
                )}

                {/* Validation Error Summary */}
                {Object.keys(validationErrors).length > 0 && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <div className="text-red-800 text-sm font-medium mb-1">
                      Please fix the following errors:
                    </div>
                    <ul className="text-red-700 text-sm space-y-1">
                      {Object.entries(validationErrors).map(
                        ([field, error]) => (
                          <li key={field}>• {error}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                <form className="w-full" onSubmit={handleSubmit}>
                  <table className="w-full">
                    <thead>
                      <tr className="text-left">
                        <th className="w-16 py-2">No.</th>
                        <th className="py-2">Parameters</th>
                        <th className="pl-2 py-2">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {botDef?.params?.properties &&
                        Object.entries(botDef.params.properties).map(
                          ([key, prop], index) => {
                            const isRequired =
                              botDef?.params?.required?.includes(key);
                            return (
                              <tr key={key}>
                                <td className="py-2">
                                  {String(index + 1).padStart(2, "0")}
                                </td>
                                <td className="py-2">
                                  <div className="flex items-center gap-1">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                    :
                                    {isRequired && (
                                      <span className="text-red-500 text-sm">
                                        *
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="pl-2 py-2">
                                  {renderInputField(key, prop)}
                                </td>
                              </tr>
                            );
                          }
                        )}
                    </tbody>
                  </table>
                  <div className="flex justify-end gap-2 pt-2">
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="px-4 py-2 rounded border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
                        disabled={isRunning}
                      >
                        Cancel
                      </button>
                    </Dialog.Close>
                    <button
                      type="submit"
                      className={cn(
                        "px-4 py-2 rounded font-semibold",
                        isRunning
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-violet-700 text-white hover:bg-violet-800"
                      )}
                      disabled={isRunning}
                    >
                      {isRunning ? "Creating Bot..." : "Run"}
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
