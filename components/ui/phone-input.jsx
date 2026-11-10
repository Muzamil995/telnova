import { Input } from "@/components/ui/input";

const COUNTRY_CODES = [
  { code: "+1", country: "US/Canada", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+1", country: "Mexico", flag: "🇲🇽" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
];

export function PhoneInput({ value, onChange, disabled = false }) {
  // Extract country code and phone number from E.164 format
  const parsePhoneValue = (phoneValue) => {
    if (!phoneValue) return { countryCode: "+1", phoneNumber: "" };

    // Try known country codes sorted longest-first so "+44" is tried before "+4",
    // preventing greedy over-capture (e.g. "+198..." should match "+1", not "+198").
    const sortedCodes = [...new Set(COUNTRY_CODES.map((c) => c.code))].sort(
      (a, b) => b.length - a.length,
    );

    for (const code of sortedCodes) {
      if (phoneValue.startsWith(code)) {
        return {
          countryCode: code,
          phoneNumber: phoneValue.slice(code.length).replace(/\D/g, ""),
        };
      }
    }

    // Fallback: default to +1
    return {
      countryCode: "+1",
      phoneNumber: phoneValue.replace(/\D/g, "").slice(0, 10),
    };
  };

  const { countryCode, phoneNumber } = parsePhoneValue(value);

  const handleCountryCodeChange = (newCountryCode) => {
    // Reconstruct phone number with new country code
    onChange({
      target: {
        name: "phoneNumber",
        value: `${newCountryCode}${phoneNumber}`,
      },
    });
  };

  const handlePhoneNumberChange = (e) => {
    const inputValue = e.target.value.replace(/\D/g, "").slice(0, 10); // Remove non-digits, max 10
    const newValue = `${countryCode}${inputValue}`;
    onChange({
      target: {
        name: "phoneNumber",
        value: newValue,
      },
    });
  };

  return (
    <div className="flex gap-2">
      <select
        value={countryCode}
        onChange={(e) => handleCountryCodeChange(e.target.value)}
        disabled={disabled}
        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {COUNTRY_CODES.map((item) => (
          <option key={`${item.code}-${item.country}`} value={item.code}>
            {item.flag} {item.country} ({item.code})
          </option>
        ))}
      </select>

      <Input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        disabled={disabled}
        className="flex-1"
        maxLength="10"
      />
    </div>
  );
}
