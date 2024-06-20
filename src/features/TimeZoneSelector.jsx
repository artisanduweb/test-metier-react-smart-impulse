import React, { useState } from 'react';
import TimeZoneSelect from "react-timezone-select";

// TODO : Implement TimeZoneSelector component
export const TimeZoneSelector = ({ onTimezoneChange }) => {
  const [selectedTimezone, setSelectedTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  const handleTimezoneChange = (timezone) => {
    setSelectedTimezone(timezone.value);
    onTimezoneChange(timezone.value);
  };

  return (
    <div className="timezone-selector">
      <TimeZoneSelect
        value={selectedTimezone}
        onChange={handleTimezoneChange}
      />
    </div>
  );
}

