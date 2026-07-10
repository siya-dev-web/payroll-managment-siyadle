import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface StatCardProps {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  badge?: string;
  filled?: boolean;
}

export function StatCard({ icon, iconBg, iconColor, label, value, badge, filled }: StatCardProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-stack-lg rounded-xl custom-shadow hover:shadow-lg transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 ${iconBg} rounded-lg`}>
          <MaterialIcon icon={icon} className={iconColor} filled={filled} />
        </div>
        {badge && (
          <span className="font-label-sm text-primary bg-primary/5 px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <h3 className="font-label-md text-on-surface-variant/70 mb-1">{label}</h3>
      <p className="font-display-md text-display-md text-on-surface">{value}</p>
    </div>
  );
}
