import Link from "next/link";
import { Button } from "@/components/ui/button";

function NotFound() {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-4 px-4 py-16 text-center">
      <span className="text-7xl sm:text-9xl font-bold text-primary">404</span>
      <h1 className="text-xl sm:text-2xl font-bold">Page not found</h1>
      <p className="max-w-sm text-sm text-foreground/70">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button
        size="lg"
        nativeButton={false}
        render={<Link href="/" />}
        className="w-full max-w-xs sm:w-auto cursor-pointer"
      >
        Go to home page
      </Button>
    </div>
  );
}

export default NotFound;
