import * as React from "react";

export interface QBTextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const QBTextInput: React.FC<QBTextInputProps> = ({
  value,
  onChange,
  placeholder = "Enter search terms...",
}) => {
  return (
    <div className="qb-text-input qb-panel">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="qb-input"
      />
    </div>
  );
};
