import { User2Icon } from "lucide-react";
import { EntityFormat } from "./EntityFormat";

class FmUserProfile extends EntityFormat {
  apiName = "user-profile:profile";

  renderEntity = (entity: any) => {
    return (
      <span className="flex items-center gap-1">
        <User2Icon className="w-4 h-4" />
        <span>
          {entity.name__given} {entity.name__family}
        </span>
      </span>
    );
  };
}

EntityFormat.registerFormat("user-profile", FmUserProfile);
export default FmUserProfile;
