"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, RefreshCw } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
    
        <div className="relative mb-8">
          <h1 className="text-9xl font-bold text-primary animate-pulse">404</h1>
          <div className="absolute -top-4 -right-4 animate-spin-slow">
            <RefreshCw className="h-8 w-8 text-primary/30" />
          </div>
        </div>

  
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you&apos;re looking for seems to have vanished into thin
          air. Let&apos;s get you back on track.
        </p>

  
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="default" size="lg" className="group" asChild>
            <Link href="/">
              <Home className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Back to Home
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="group"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
            Go Back
          </Button>
        </div>

  
        <div className="mt-16 relative">
          <div className="absolute -left-8 top-0 w-16 h-16 bg-primary/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute -right-8 bottom-0 w-16 h-16 bg-secondary/10 rounded-full blur-xl animate-pulse delay-300" />
          <div className="relative z-10">
            <p className="text-sm text-gray-500">
              Need help?{" "}
              <Link
                href="mailto:0xprathamesh@gmail.com"
                className="text-primary hover:underline"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>

    
      <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
}

