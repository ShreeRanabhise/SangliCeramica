import { Loader } from "@/components/ui/loader";

export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <Loader text="Loading dashboard..." />
    </div>
  );
}
