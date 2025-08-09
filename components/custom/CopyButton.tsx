"use client";

import React, { useState, useRef, useEffect } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  textToCopy: string;
  className?: string;
}

export function CopyButton({ textToCopy, className }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = () => {
    if (isCopied) return;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    timeoutRef.current = setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("flex-shrink-0", className)}
      onClick={handleCopy}
    >
      {isCopied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  );
}

interface CopyBadgeProps {
  textToCopy: string;
}

export function CopyBadge({ textToCopy }: CopyBadgeProps) {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = () => {
    if (isCopied) return;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    timeoutRef.current = setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div
      className="inline-flex items-center group relative cursor-pointer max-w-full"
      onClick={handleCopy}
      title={textToCopy}
    >
      <Badge
        variant="outline"
        className="text-center text-sm font-semibold pr-7 max-w-full leading-tight !whitespace-normal"
        style={{
          wordBreak: 'break-word',
          hyphens: 'auto',
          display: '-webkit-box',
          WebkitLineClamp: 8,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {textToCopy}
      </Badge>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-full w-7 flex items-center justify-center pointer-events-none">
        {isCopied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 opacity-50 group-hover:opacity-100" />
        )}
      </div>
    </div>
  );
}