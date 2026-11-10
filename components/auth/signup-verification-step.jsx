import Icon from "@/components/landing/Icon";
import { C, BD, HL } from "@/components/landing/tokens";
import { PrimaryButton, OutlineButton } from "@/components/auth/auth-ui";

const OPTIONS = [
  {
    id: "email",
    icon: "mail",
    title: "Verify with Email",
    desc: "Send OTP to your registered email address.",
  },
  {
    id: "phone",
    icon: "smartphone",
    title: "Verify with Phone",
    desc: "Send OTP via SMS to your phone number.",
  },
];

export function SignupVerificationStep({
  value,
  onChange,
  onBack,
  onContinue,
  disabled = false,
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {OPTIONS.map((opt) => {
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className="p-5 rounded-2xl text-left transition-all"
              style={{
                border: `2px solid ${selected ? C.primary : C.outlineVariant}`,
                backgroundColor: selected
                  ? `${C.primaryFixed}55`
                  : C.surfaceLowest,
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{
                  backgroundColor: selected ? C.primary : C.surfaceLow,
                }}
              >
                <Icon
                  name={opt.icon}
                  size={18}
                  fill={1}
                  style={{ color: selected ? "#ffffff" : C.onSurfaceVariant }}
                />
              </div>
              <p
                className="font-bold text-sm mb-1"
                style={{ color: C.onSurface, ...HL }}
              >
                {opt.title}
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: C.onSurfaceVariant, ...BD }}
              >
                {opt.desc}
              </p>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3 justify-end">
        <OutlineButton type="button" onClick={onBack} disabled={disabled}>
          Back
        </OutlineButton>
        <PrimaryButton
          type="button"
          onClick={onContinue}
          disabled={disabled}
          className="px-8"
        >
          {disabled ? "Creating account..." : "Send code"}
        </PrimaryButton>
      </div>
    </div>
  );
}
