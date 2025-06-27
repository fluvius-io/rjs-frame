import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { APIManager } from "rjs-frame";
import * as Tooltip from "@radix-ui/react-tooltip";

interface BotDefinition {
  name: string;
  key: string;
  description: string;
  params: Record<string, any>;
}

interface BotConfigModalProps {
  open: boolean;
  onClose: () => void;
  botDefId: string;
  onRun: (params: Record<string, any>) => void;
}

function isObjectSchema(def: any): def is { [key: string]: any } {
  return typeof def === "object" && def !== null && !Array.isArray(def);
}

export const InfoTooltip = ({ content }: { content: string }) => (
  <Tooltip.Provider delayDuration={100}>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <span className="text-gray-500 cursor-pointer text-xs font-bold border border-gray-400 rounded-full w-4 h-4 flex items-center justify-center">
          i
        </span>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="right"
          className="bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-md z-50"
          sideOffset={10}
        >
          {content}
          <Tooltip.Arrow className="fill-gray-800" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
);

export function BotConfigModal({ open, onClose, botDefId, onRun }: BotConfigModalProps) {
  const [botDef, setBotDef] = useState<BotDefinition | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !botDefId) return;
    setLoading(true);
    setError("");
    setBotDef(null);
    APIManager.queryItem("trade-bot:bot-definition", botDefId, { cache: true })
      .then((response: { data: BotDefinition }) => {
        setBotDef(response.data);
      })
      .catch(() => setError("Failed to load bot definition."))
      .finally(() => setLoading(false));
  }, [open, botDefId]);

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
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
                    <span className="font-bold">Description:</span> {botDef.description}
                  </div>
                </div>
              </div>
              {/* Form */}
              <div className="p-4 pt-0">
                <p className="mb-2 text-sm text-gray-700">
                  Fill in the required parameters to run the bot.
                </p>
                <form className="w-full" onSubmit={e => { e.preventDefault(); onRun(formData); }}>
                  <table className="w-full">
                    <thead>
                      <tr className="text-left">
                        <th className="w-16 py-2">No.</th>
                        <th className="py-2">Parameters</th>
                        <th className="py-2">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {botDef?.params?.properties && Object.entries(botDef.params.properties).map(([key, prop], index) => (
                        <tr key={key}>
                          <td className="py-2">{String(index + 1).padStart(2, '0')}</td>
                          <td className="py-2">
                            <div className="flex items-center gap-1">
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                              {isObjectSchema(prop) && prop.description && <InfoTooltip content={prop.description} />}
                            </div>
                          </td>
                          <td className="py-2">
                            {isObjectSchema(prop) && prop.type === 'string' && Array.isArray(prop.enum) && prop.enum.every(v => typeof v === 'string') ? (
                              <select
                                value={formData[key] || ''}
                                onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              >
                                <option value="">Select {key}</option>
                                {(prop.enum as string[]).map((option, index) => (
                                  <option key={index} value={option}>{option}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                placeholder={`Input ${key}. e.g. ${isObjectSchema(prop) && prop.examples && Array.isArray(prop.examples) && prop.examples.length > 0 ? prop.examples[0] : ''}`}
                                value={formData[key] || ''}
                                onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-end gap-2 pt-2">
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="px-4 py-2 rounded border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
                        onClick={() => console.log('Form Data:', formData)}
                      >
                        Cancel
                      </button>
                    </Dialog.Close>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-violet-700 text-white font-semibold hover:bg-violet-800"
                      onClick={() => console.log('Form Data:', formData)}
                    >
                      Run
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
