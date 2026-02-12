"use client";

import { Clock3 } from "lucide-react";

export default function ActivityPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Clock3 className="mb-4 h-12 w-12 text-muted-foreground" />
      <h1 className="text-xl font-bold">Activity</h1>
      <p className="mt-2 text-muted-foreground">
        Your transaction history will appear here.
      </p>
    </div>
  );
}
