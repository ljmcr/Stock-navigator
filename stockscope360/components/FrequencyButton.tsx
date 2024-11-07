import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useSettingsContext } from "@/context/SettingsContext";

export default function FrequencyButton() {
  const { frequency, setFrequency } = useSettingsContext();

  const handleFrequencyChange = (event: any, newFrequency: any) => {
    if (newFrequency !== null) {
      setFrequency(newFrequency);
    }
  };

  return (
    <ToggleButtonGroup
      value={frequency}
      exclusive
      onChange={handleFrequencyChange}
      aria-label="Frequency"
    >
      <ToggleButton value="daily" aria-label="Daily">
        Daily
      </ToggleButton>
      <ToggleButton value="monthly" aria-label="Monthly">
        Monthly
      </ToggleButton>
      <ToggleButton value="yearly" aria-label="Yearly">
        Yearly
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
