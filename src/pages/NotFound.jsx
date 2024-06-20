import { Button } from "@/components/ui/button";
import { ArrowUpIcon } from "@/components/icons";
export const NotFound = () => {
  return (
    <div className="p-3 flex flex-col items-center justify-center space-y-4 h-screen">
      <div>
        This page could not be found <strong>(404)</strong>.
      </div>
      <Button size="sm" variant="outline" asChild>
        <a href="/">
          Go to homepage <ArrowUpIcon className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </div>
  );
};
