"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { VirtuosoGrid, VirtuosoGridHandle } from "react-virtuoso";
import { ChevronDown, ChevronUp, Copy, Check, ArrowLeft } from "lucide-react";
import { ImageDialog } from "@/components/ImageDialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ImageData {
  index: number;
  image_url: string;
  parameters: Record<string, unknown>;
  info: string;
}

interface ModelInfo {
  title: string;
  description: {
    en_US: string;
    zh_CN: string;
  };
}

export interface ModelData {
  modelInfo: ModelInfo;
  imageData: ImageData[];
  tableHeaders: string[];
  tableRows: string[][];
}

interface ModelClientPageProps {
  modelData: ModelData;
  modelName: string;
}

export function ModelClientPage({
  modelData,
  modelName,
}: ModelClientPageProps) {
  const { modelInfo, imageData, tableHeaders, tableRows } = modelData;
  const isMobile = useIsMobile();
  const virtuosoRef = useRef<VirtuosoGridHandle>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isManuallyExpanded, setIsManuallyExpanded] = useState(false);
  const [copiedRowIndex, setCopiedRowIndex] = useState<number | null>(null);

  const handleCopy = (text: string, rowIndex: number) => {
    if (copiedRowIndex === rowIndex) return;
    navigator.clipboard.writeText(text);
    setCopiedRowIndex(rowIndex);
    setTimeout(() => {
      setCopiedRowIndex(null);
    }, 2000);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
      if (!scrolled) {
        setIsManuallyExpanded(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storageKey = `scroll-position-${modelName}`;
    const savedPosition = localStorage.getItem(storageKey);
    if (savedPosition && virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: parseInt(savedPosition, 10),
        align: "start",
      });
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [modelName]);

  const handleRangeChange = (range: { startIndex: number; endIndex: number }) => {
    const storageKey = `scroll-position-${modelName}`;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      localStorage.setItem(storageKey, range.startIndex.toString());
    }, 500);
  };

  const getImageDataByIndex = (indexStr: string): ImageData | undefined => {
    const index = parseInt(indexStr, 10);
    return imageData.find((img) => img.index === index);
  };

  const renderImageCell = (image: ImageData | undefined) => {
    if (!image) {
      return null;
    }
    return (
      <ImageDialog imageUrl={image.image_url} altText={`Image ${image.index}`}>
        <div className="relative w-full aspect-[13/19] cursor-pointer overflow-hidden rounded-md group">
          <Image
            src={image.image_url}
            alt={`Image ${image.index}`}
            fill
            className="object-cover rounded-md transition-transform duration-300 ease-in-out group-hover:scale-105"
            unoptimized
          />
        </div>
      </ImageDialog>
    );
  };


  const scrollToTop = () => {
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      virtuosoRef.current?.scrollToIndex({ index: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="bg-background pb-4 sticky top-0 z-10">
        <div className="mb-4 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Link href="/" passHref>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-4xl font-bold tracking-tight">
              {modelInfo.title}
            </h1>
          </div>
          {isScrolled && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsManuallyExpanded(!isManuallyExpanded)}
              className="flex items-center"
            >
              {isManuallyExpanded ? "收起" : "展开"}
              {isManuallyExpanded ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        <div
          className={cn(
            "transition-all duration-300 ease-in-out overflow-hidden",
            !isScrolled || isManuallyExpanded
              ? "max-h-48 opacity-100"
              : "max-h-0 opacity-0"
          )}
        >
          <div className="p-4 bg-muted/50 rounded-lg mt-2">
            <p className="text-sm text-muted-foreground">
              {modelInfo.description.zh_CN}
            </p>
          </div>
        </div>
        {!isMobile && (
          <div
            className="grid gap-2 font-semibold text-sm text-muted-foreground pt-2 mt-2 border-t border-border"
            style={{
              gridTemplateColumns: `repeat(${tableHeaders.length}, minmax(0, 1fr))`,
            }}
          >
            {tableHeaders.map((header, index) => (
              <div key={index} className="text-center p-2">
                {header}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-2">
        {isMobile ? (
          <div className="space-y-4">
            {tableRows.map((row, rowIndex) => (
              <Card
                key={rowIndex}
                className={cn({ "bg-muted": rowIndex % 2 !== 0 })}
              >
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <CardTitle className="text-base font-semibold leading-snug">
                    {`${rowIndex + 1}. ${row[0]}`}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0"
                    onClick={() => handleCopy(row[0], rowIndex)}
                  >
                    {copiedRowIndex === rowIndex ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  {row.slice(1).map((cell, cellIndex) => (
                    <div key={cellIndex}>
                      {renderImageCell(getImageDataByIndex(cell))}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div>
            <div>
              <VirtuosoGrid
                ref={virtuosoRef}
                useWindowScroll
                totalCount={tableRows.length * tableHeaders.length}
                overscan={1500}
                rangeChanged={handleRangeChange}
                components={{
                  List: React.forwardRef<
                    HTMLDivElement,
                    { style?: React.CSSProperties; children?: React.ReactNode }
                  >(function List({ style, children }, ref) {
                    return (
                      <div
                        ref={ref}
                        style={{
                          ...style,
                          gridTemplateColumns: `repeat(${tableHeaders.length}, minmax(0, 1fr))`,
                        }}
                        className="grid"
                      >
                        {children}
                      </div>
                    );
                  }),
                  Item: (props) => <div {...props} />,
                }}
                itemContent={(index) => {
                  const numCols = tableHeaders.length;
                  const rowIndex = Math.floor(index / numCols);
                  const colIndex = index % numCols;
                  const row = tableRows[rowIndex];

                  if (!row) return null;

                  const cell = row[colIndex];
                  const rowBg =
                    rowIndex % 2 !== 0 ? "bg-muted" : "bg-transparent";
                  const borderClass = "border-b border-border";

                  if (colIndex === 0) {
                    return (
                      <div
                        className={cn(
                          "flex items-center justify-center p-2 h-full",
                          rowBg,
                          borderClass
                        )}
                      >
                        <div className="text-center">
                          <div className="text-muted-foreground text-xs font-medium">
                            {rowIndex + 1}
                          </div>
                          <div
                            className="inline-flex items-center group relative cursor-pointer"
                            onClick={() => handleCopy(cell, rowIndex)}
                          >
                            <Badge
                              variant="outline"
                              className="whitespace-normal text-center text-sm font-semibold pr-7"
                            >
                              {cell}
                            </Badge>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-full w-7 flex items-center justify-center pointer-events-none">
                              {copiedRowIndex === rowIndex ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className={cn("p-2 h-full", rowBg, borderClass)}>
                      {renderImageCell(getImageDataByIndex(cell))}
                    </div>
                  );
                }}
              />
            </div>
          </div>
        )}
      </div>
      <Button
        variant="secondary"
        size="icon"
        className={cn(
          "fixed bottom-8 right-8 z-50 rounded-full transition-opacity duration-300",
          isScrolled ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
    </div>
  );
}