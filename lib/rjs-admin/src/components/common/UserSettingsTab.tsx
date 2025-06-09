import { Bell, Globe, Monitor, Palette, Save, Shield } from "lucide-react";
import { useState } from "react";

export function UserSettingsTab() {
  const [preferences, setPreferences] = useState({
    theme: "system",
    language: "en",
    notifications: {
      email: true,
      push: false,
      desktop: true,
    },
    privacy: {
      profileVisibility: "organization",
      activityTracking: true,
    },
    accessibility: {
      reducedMotion: false,
      highContrast: false,
      fontSize: "medium",
    },
  });

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving preferences:", preferences);
  };

  const updatePreference = (section: string, key: string, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof prev] as any),
        [key]: value,
      },
    }));
  };

  const updateSimplePreference = (key: string, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="user-tab">
      {/* Appearance Section */}
      <div className="user-tab__section">
        <h3 className="user-tab__section-title">
          <Palette className="h-4 w-4" />
          Appearance
        </h3>
        <div className="user-tab__section-content">
          <div className="user-tab__field">
            <label className="user-tab__field-label">Theme</label>
            <select
              className="user-tab__select"
              value={preferences.theme}
              onChange={(e) => updateSimplePreference("theme", e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
          <div className="user-tab__field">
            <label className="user-tab__field-label">Font Size</label>
            <select
              className="user-tab__select"
              value={preferences.accessibility.fontSize}
              onChange={(e) =>
                updatePreference("accessibility", "fontSize", e.target.value)
              }
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
      </div>

      {/* Localization Section */}
      <div className="user-tab__section">
        <h3 className="user-tab__section-title">
          <Globe className="h-4 w-4" />
          Language & Region
        </h3>
        <div className="user-tab__section-content">
          <div className="user-tab__field">
            <label className="user-tab__field-label">Language</label>
            <select
              className="user-tab__select"
              value={preferences.language}
              onChange={(e) =>
                updateSimplePreference("language", e.target.value)
              }
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="it">Italiano</option>
              <option value="pt">Português</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="user-tab__section">
        <h3 className="user-tab__section-title">
          <Bell className="h-4 w-4" />
          Notifications
        </h3>
        <div className="user-tab__section-content">
          <div className="user-tab__field user-tab__field--checkbox">
            <label className="user-tab__checkbox-label">
              <input
                type="checkbox"
                className="user-tab__checkbox"
                checked={preferences.notifications.email}
                onChange={(e) =>
                  updatePreference("notifications", "email", e.target.checked)
                }
              />
              Email Notifications
            </label>
            <p className="user-tab__field-description">
              Receive notifications via email
            </p>
          </div>
          <div className="user-tab__field user-tab__field--checkbox">
            <label className="user-tab__checkbox-label">
              <input
                type="checkbox"
                className="user-tab__checkbox"
                checked={preferences.notifications.push}
                onChange={(e) =>
                  updatePreference("notifications", "push", e.target.checked)
                }
              />
              Push Notifications
            </label>
            <p className="user-tab__field-description">
              Receive push notifications on mobile devices
            </p>
          </div>
          <div className="user-tab__field user-tab__field--checkbox">
            <label className="user-tab__checkbox-label">
              <input
                type="checkbox"
                className="user-tab__checkbox"
                checked={preferences.notifications.desktop}
                onChange={(e) =>
                  updatePreference("notifications", "desktop", e.target.checked)
                }
              />
              Desktop Notifications
            </label>
            <p className="user-tab__field-description">
              Show desktop notifications while using the app
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Section */}
      <div className="user-tab__section">
        <h3 className="user-tab__section-title">
          <Shield className="h-4 w-4" />
          Privacy & Security
        </h3>
        <div className="user-tab__section-content">
          <div className="user-tab__field">
            <label className="user-tab__field-label">Profile Visibility</label>
            <select
              className="user-tab__select"
              value={preferences.privacy.profileVisibility}
              onChange={(e) =>
                updatePreference("privacy", "profileVisibility", e.target.value)
              }
            >
              <option value="public">Public</option>
              <option value="organization">Organization Only</option>
              <option value="private">Private</option>
            </select>
            <p className="user-tab__field-description">
              Control who can see your profile information
            </p>
          </div>
          <div className="user-tab__field user-tab__field--checkbox">
            <label className="user-tab__checkbox-label">
              <input
                type="checkbox"
                className="user-tab__checkbox"
                checked={preferences.privacy.activityTracking}
                onChange={(e) =>
                  updatePreference(
                    "privacy",
                    "activityTracking",
                    e.target.checked
                  )
                }
              />
              Activity Tracking
            </label>
            <p className="user-tab__field-description">
              Allow the app to track your activity for analytics
            </p>
          </div>
        </div>
      </div>

      {/* Accessibility Section */}
      <div className="user-tab__section">
        <h3 className="user-tab__section-title">
          <Monitor className="h-4 w-4" />
          Accessibility
        </h3>
        <div className="user-tab__section-content">
          <div className="user-tab__field user-tab__field--checkbox">
            <label className="user-tab__checkbox-label">
              <input
                type="checkbox"
                className="user-tab__checkbox"
                checked={preferences.accessibility.reducedMotion}
                onChange={(e) =>
                  updatePreference(
                    "accessibility",
                    "reducedMotion",
                    e.target.checked
                  )
                }
              />
              Reduce Motion
            </label>
            <p className="user-tab__field-description">
              Minimize animations and transitions
            </p>
          </div>
          <div className="user-tab__field user-tab__field--checkbox">
            <label className="user-tab__checkbox-label">
              <input
                type="checkbox"
                className="user-tab__checkbox"
                checked={preferences.accessibility.highContrast}
                onChange={(e) =>
                  updatePreference(
                    "accessibility",
                    "highContrast",
                    e.target.checked
                  )
                }
              />
              High Contrast
            </label>
            <p className="user-tab__field-description">
              Increase contrast for better readability
            </p>
          </div>
        </div>
      </div>

      {/* Save Section */}
      <div className="user-tab__actions">
        <button className="user-tab__save-button" onClick={handleSave}>
          <Save className="h-4 w-4" />
          Save Settings
        </button>
        <p className="user-tab__save-note">
          Settings are automatically saved to your profile
        </p>
      </div>
    </div>
  );
}
