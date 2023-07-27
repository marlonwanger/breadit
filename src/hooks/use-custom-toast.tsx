import Link from "next/link";
import { toast } from "./use-toast";
import { buttonVariants } from "@/components/ui/button";

export function useCustomToast() {
  const loginToast = () => {
    const { dismiss } = toast({
      title: "Login required",
      description: "Please try again",
      variant: "destructive",
      action: (
        <Link
          className={buttonVariants({ variant: "outline", className: "text-black" })}
          onClick={() => dismiss()}
          href="/sign-in"
        >
          Login
        </Link>
      ),
    });
  };

  return { loginToast };
}
