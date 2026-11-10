import { C, BD, HL } from "@/components/landing/tokens";

const steps = [
  { id: 1, label: "Account" },
  { id: 2, label: "Verification" },
  { id: 3, label: "Code" },
];

export function SignupStepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                style={{
                  backgroundColor:
                    isCompleted || isActive ? C.primary : C.surfaceHigh,
                  color:
                    isCompleted || isActive ? "#ffffff" : C.onSurfaceVariant,
                }}
              >
                {isCompleted ? "✓" : step.id}
              </div>
              <span
                className="text-xs font-semibold"
                style={{
                  color: isActive ? C.primary : C.onSurfaceVariant,
                  ...BD,
                }}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className="w-14 h-0.5 mb-5 mx-2"
                style={{
                  backgroundColor:
                    step.id < currentStep ? C.primary : C.surfaceHigh,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
