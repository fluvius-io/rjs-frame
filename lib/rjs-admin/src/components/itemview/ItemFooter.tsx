import { Calendar, Clock, UserPen, UserPlus } from "lucide-react";
import { updatePageParams } from "rjs-frame";
import { formatDateTime } from "../../lib/utils";
import { FmUserProfile } from "../entity";

function ItemFooter({ item }: { item: any }) {
  return (
    <div className="border-t pt-3 border-gray-100">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => {
            updatePageParams({
              modal: `profile.${item.creator}`,
            });
          }}
        >
          <FmUserProfile itemId={item.creator} itemIcon={UserPlus} />
          <Calendar className="w-3 h-3 ml-3" />
          <span className="mr-2">{formatDateTime(new Date(item.created))}</span>
        </div>
        {item.updater && (
          <div className="flex items-center gap-1">
            <FmUserProfile itemId={item.updater} itemIcon={UserPen} />
            <Clock className="w-3 h-3 ml-2" />
            <span className="mr-2">{formatDateTime(item.updated)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemFooter;
