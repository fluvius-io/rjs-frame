import { EntityFormat } from "./EntityFormat";

class FmUserProfile extends EntityFormat {
  apiName = "idm:user";

  renderEntity = (entity: any) => {
    console.log("FmUserProfile", entity);
    return <div>User: {entity.name}</div>;
  };
}

EntityFormat.registerFormat("user-profile", FmUserProfile);
export default FmUserProfile;
