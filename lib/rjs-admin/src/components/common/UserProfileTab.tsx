import { Building, Calendar, Mail, Shield, Tag, User } from "lucide-react";
import { useAppContext } from "rjs-frame";

export function UserProfileTab() {
  const { authContext } = useAppContext();

  if (!authContext) {
    return (
      <div className="user-tab__empty">
        <p>No profile information available</p>
      </div>
    );
  }

  const { user, profile, organization } = authContext;

  return (
    <div className="user-tab">
      {/* Personal Information Section */}
      <div className="user-tab__section">
        <h3 className="user-tab__section-title">
          <User className="h-4 w-4" />
          Personal Information
        </h3>
        <div className="user-tab__section-content">
          <div className="user-tab__field-group">
            <div className="user-tab__field">
              <label className="user-tab__field-label user-tab__field-label--profile">
                Full Name
              </label>
              <p className="user-tab__field-value">
                {user.name__given && user.name__family
                  ? `${user.name__given} ${user.name__family}`
                  : user.username || "Not specified"}
              </p>
            </div>
            <div className="user-tab__field">
              <label className="user-tab__field-label user-tab__field-label--profile">
                Username
              </label>
              <p className="user-tab__field-value">
                {user.username || "Not specified"}
              </p>
            </div>
          </div>
          <div className="user-tab__field-group">
            <div className="user-tab__field">
              <label className="user-tab__field-label user-tab__field-label--profile">
                First Name
              </label>
              <p className="user-tab__field-value">
                {user.name__given || "Not specified"}
              </p>
            </div>
            <div className="user-tab__field">
              <label className="user-tab__field-label user-tab__field-label--profile">
                Last Name
              </label>
              <p className="user-tab__field-value">
                {user.name__family || "Not specified"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="user-tab__section">
        <h3 className="user-tab__section-title">
          <Mail className="h-4 w-4" />
          Contact Information
        </h3>
        <div className="user-tab__section-content">
          <div className="user-tab__field-group">
            <div className="user-tab__field">
              <label className="user-tab__field-label user-tab__field-label--profile">
                Email
              </label>
              <p className="user-tab__field-value">
                {user.telecom__email || user.verified_email || "Not specified"}
              </p>
            </div>
            <div className="user-tab__field">
              <label className="user-tab__field-label user-tab__field-label--profile">
                Phone
              </label>
              <p className="user-tab__field-value">
                {user.telecom__phone || user.verified_phone || "Not specified"}
              </p>
            </div>
          </div>
          <div className="user-tab__field">
            <label className="user-tab__field-label user-tab__field-label--profile">
              Status
            </label>
            <div className="user-tab__field-value">
              <span
                className={`user-tab__status-badge user-tab__status-badge--${
                  user.status?.toLowerCase() || "unknown"
                }`}
              >
                {user.status || "Unknown"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account & Security Section */}
      <div className="user-tab__section">
        <h3 className="user-tab__section-title">
          <Shield className="h-4 w-4" />
          Account & Security
        </h3>
        <div className="user-tab__section-content">
          <div className="user-tab__field-group">
            <div className="user-tab__field">
              <label className="user-tab__field-label user-tab__field-label--profile">
                Admin Status
              </label>
              <p className="user-tab__field-value">
                <span
                  className={`user-tab__admin-badge ${
                    user.is_super_admin
                      ? "user-tab__admin-badge--admin"
                      : "user-tab__admin-badge--user"
                  }`}
                >
                  {user.is_super_admin ? "Super Admin" : "Regular User"}
                </span>
              </p>
            </div>
            <div className="user-tab__field">
              <label className="user-tab__field-label user-tab__field-label--profile">
                Account ID
              </label>
              <p className="user-tab__field-value user-tab__field-value--mono">
                {user._id || "Not available"}
              </p>
            </div>
          </div>
          <div className="user-tab__field">
            <label className="user-tab__field-label user-tab__field-label--profile">
              Realm Access Roles
            </label>
            <div className="user-tab__tags">
              {user.realm_access?.roles?.map((role: string, index: number) => (
                <span key={index} className="user-tab__tag">
                  <Tag className="h-3 w-3" />
                  {role}
                </span>
              )) || (
                <span className="user-tab__field-value">No roles assigned</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Organization Section */}
      <div className="user-tab__section">
        <h3 className="user-tab__section-title">
          <Building className="h-4 w-4" />
          Organization
        </h3>
        <div className="user-tab__section-content">
          <div className="user-tab__field-group">
            <div className="user-tab__field">
              <label className="user-tab__field-label user-tab__field-label--profile">
                Organization
              </label>
              <p className="user-tab__field-value">
                {organization?.name || "Not specified"}
              </p>
            </div>
            <div className="user-tab__field">
              <label className="user-tab__field-label user-tab__field-label--profile">
                Profile
              </label>
              <p className="user-tab__field-value">
                {profile?.name || "Default Profile"}
              </p>
            </div>
          </div>
          <div className="user-tab__field">
            <label className="user-tab__field-label user-tab__field-label--profile">
              Realm
            </label>
            <p className="user-tab__field-value">
              {authContext.realm || "Not specified"}
            </p>
          </div>
        </div>
      </div>

      {/* Account Dates Section */}
      <div className="user-tab__section">
        <h3 className="user-tab__section-title">
          <Calendar className="h-4 w-4" />
          Account Information
        </h3>
        <div className="user-tab__section-content">
          <div className="user-tab__field-group">
            <div className="user-tab__field">
              <label className="user-tab__field-label user-tab__field-label--profile">
                Created Date
              </label>
              <p className="user-tab__field-value">
                {user._created
                  ? new Date(user._created).toLocaleDateString()
                  : "Not available"}
              </p>
            </div>
            <div className="user-tab__field">
              <label className="user-tab__field-label user-tab__field-label--profile">
                Last Updated
              </label>
              <p className="user-tab__field-value">
                {user._updated
                  ? new Date(user._updated).toLocaleDateString()
                  : "Not available"}
              </p>
            </div>
          </div>
          <div className="user-tab__field">
            <label className="user-tab__field-label user-tab__field-label--profile">
              Last Verified Request
            </label>
            <p className="user-tab__field-value">
              {user.last_verified_request
                ? new Date(user.last_verified_request).toLocaleString()
                : "Never"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
