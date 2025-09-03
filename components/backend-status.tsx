"use client";

import { Badge } from "@/components/ui/badge";

export default function BackendStatus() {
  return (
    <Badge variant="outline" className="text-xs">
      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
      Online
    </Badge>
  );
}
