"use client";

import { Button } from "./ui/button";

export default function BackendStatus() {
  return (
    <Button
    variant="outline"
    size="sm"
    className="hidden sm:flex items-center gap-2"
  >
      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
      Online
    </Button>
  );
}
