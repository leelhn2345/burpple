import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLElement>;

export function Spinner({ className }: Props) {
  return (
    <Loader2
      className={cn(
        "h-8 w-8 animate-spin text-primary/60 dark:text-black",
        className,
      )}
    />
  );
}
