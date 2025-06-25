import { useItemView } from "rjs-admin";
import { APIManager } from "rjs-frame";
import { useEffect, useState } from "react";

export const BotDefinitionDetailView = () => {
  const { item } = useItemView();
  const [loading, setLoading] = useState(true);
  const [botDefinition, setBotDefinition] = useState<any>(null);

  useEffect(() => {
    const fetchBotDefinition = async () => {
      try {
        setLoading(true);
        const response = await APIManager.queryItem("trade-bot:bot-definition", item.bot_def_id);
        setBotDefinition(response.data);
      } catch (error) {
        console.error("Error fetching bot definition:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBotDefinition();
  }, [item.bot_def_id]);

  if (loading) {
    return <div>Loading bot definition...</div>;
  }

  if (!botDefinition) {
    return <div>No bot definition found</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Bot Definition</h2>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <label className="text-sm text-muted-foreground">Name</label>
            <div>{botDefinition.name}</div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">ID</label>
            <div>{botDefinition.id}</div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Description</label>
            <div>{botDefinition.description}</div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Created At</label>
            <div>{new Date(botDefinition.created_at).toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-md font-semibold">Configuration</h3>
        <pre className="mt-2 p-2 bg-muted rounded">
          {JSON.stringify(botDefinition.config, null, 2)}
        </pre>
      </div>
    </div>
  );
};