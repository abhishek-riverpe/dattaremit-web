import { Separator } from "@/components/ui/separator";

export function OrDivider() {
  return (
    <div className="relative my-6">
      <Separator />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-muted/80 px-2 text-xs text-muted-foreground">
        or
      </span>
    </div>
  );
}
