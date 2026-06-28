import { Loader } from "@/components/ui/loader";

export default function Loading() {
  return (
    <div className="pt-24 min-h-[70vh] flex items-center justify-center">
      <Loader />
    </div>
  );
}
