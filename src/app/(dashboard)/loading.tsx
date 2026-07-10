import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function DashboardLoading() {
  return (
    <div className="ml-[260px] min-h-screen flex items-center justify-center">
      <LoadingSpinner text="Loading..." />
    </div>
  );
}
