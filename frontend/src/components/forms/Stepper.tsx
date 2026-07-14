import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface Step {
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="mb-stack-xl flex items-center justify-between relative">
      <div className="absolute top-5 left-0 w-full h-[2px] bg-outline-variant -z-10" />
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={step.label} className="flex flex-col items-center gap-2 bg-background px-4">
            <div
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all shadow-sm ${
                isActive
                  ? "bg-surface border-primary text-primary font-bold"
                  : isCompleted
                    ? "bg-primary border-primary text-on-primary"
                    : "bg-surface border-outline-variant text-on-surface-variant/50"
              }`}
            >
              {isCompleted ? (
                <MaterialIcon icon="check" className="text-sm" />
              ) : (
                stepNum
              )}
            </div>
            <span
              className={`font-label-sm ${
                isActive ? "text-primary" : isCompleted ? "text-on-surface-variant" : "text-on-surface-variant/50"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
