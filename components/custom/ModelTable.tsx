"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { VirtuosoGrid, VirtuosoGridHandle } from "react-virtuoso";
import { ChevronUp, ArrowLeft } from "lucide-react";
import { ModelImageDialog } from "@/components/custom/ModelImageDialog";
import { CopyBadge, CopyButton } from "@/components/custom/CopyButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/custom/page-header";
import { useRouter } from "next/navigation";

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
  promptOrder: string[];
  commonPrompts: string[][];
}

interface ModelClientPageProps {
  modelData: ModelData;
  modelName: string;
}

const ItemContainer = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props} />
);
ItemContainer.displayName = "ItemContainer";

export function ModelClientPage({
  modelData,
  modelName,
}: ModelClientPageProps) {
  const { modelInfo, imageData, tableHeaders, tableRows, promptOrder, commonPrompts } = modelData;
  const isMobile = useIsMobile();
  const router = useRouter();
  const virtuosoRef = useRef<VirtuosoGridHandle>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isManuallyExpanded, setIsManuallyExpanded] = useState(false);

  const gridComponents = useMemo(() => {
    const ListContainer = React.forwardRef<
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
    });
    ListContainer.displayName = "ListContainer";

    return {
      List: ListContainer,
      Item: ItemContainer,
    };
  }, [tableHeaders.length]);

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

  const renderColumnBadges = () => {
    if (!promptOrder || !commonPrompts || commonPrompts.length === 0) {
      return null;
    }

    const headerRow = commonPrompts[0] || []; // CSV header row
    const firstRowData = commonPrompts[1] || []; // First data row
    const badgeVariants = ["default", "secondary", "outline", "destructive"] as const;
    
    return (
      <div className="flex flex-wrap gap-1 justify-center max-w-full">
        {promptOrder.map((category, promptIndex) => {
          let content = "";
          
          if (category === "Style tags") {
            content = "画师风格";
          } else {
            // Find matching header in CSV
            const csvIndex = headerRow.findIndex(header => 
              header.trim().toLowerCase() === category.toLowerCase()
            );
            if (csvIndex !== -1 && firstRowData[csvIndex]) {
              content = firstRowData[csvIndex].trim();
              // Remove trailing comma if present
              content = content.replace(/,$/, "");
            }
          }
          
          if (!content) return null;
          
          const variant = badgeVariants[promptIndex % badgeVariants.length];
          
          return (
            <Badge
              key={category}
              variant={variant}
              className="text-xs whitespace-normal break-words"
              title={content}
            >
              {content}
            </Badge>
          );
        })}
      </div>
    );
  };

  const renderImageCell = (image: ImageData | undefined) => {
    if (!image) {
      return null;
    }
    return (
      <ModelImageDialog
        imageUrl={image.image_url}
        altText={`Image ${image.index}`}
        imageInfo={image.info}
      >
        <div className="relative w-full aspect-[13/19] cursor-pointer overflow-hidden rounded-lg group">
          <Image
            src={image.image_url}
            alt={`Image ${image.index}`}
            fill
            className="object-cover rounded-lg transition-transform duration-300 ease-in-out group-hover:scale-110"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </ModelImageDialog>
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <PageHeader />
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="bg-background/80 backdrop-blur-sm pb-4 sticky top-0 z-10 border-b border-border/50">
          <div className="mb-4 flex items-start gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full hover:bg-accent/50"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {modelInfo.title}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">模型详情与对比</p>
            </div>
          </div>

          <div
            className={cn(
              "transition-all duration-300 ease-in-out overflow-hidden",
              !isScrolled || isManuallyExpanded
                ? "max-h-48 opacity-100"
                : "max-h-0 opacity-0"
            )}
          >
            <div className="p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl mt-2 border border-border/50">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {modelInfo.description.zh_CN}
              </p>
            </div>
          </div>

          {!isMobile && (
            <div
              className="grid gap-2 font-semibold text-sm text-muted-foreground pt-3 mt-3 border-t border-border/50"
              style={{
                gridTemplateColumns: `repeat(${tableHeaders.length}, minmax(0, 1fr))`,
              }}
            >
              {tableHeaders.map((header, index) => (
                <div key={index} className="text-center p-2 font-medium space-y-2">
                  <div className="text-xs text-muted-foreground">
                    {header}
                  </div>
                  {renderColumnBadges()}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          {isMobile ? (
            <div className="space-y-4">
              {tableRows.map((row, rowIndex) => (
                <Card
                  key={rowIndex}
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    "hover:shadow-lg hover:shadow-primary/5",
                    rowIndex % 2 !== 0 ? "bg-muted/30" : "bg-card"
                  )}
                >
                  <CardHeader className="flex flex-col gap-3 pb-3">
                    <div className="flex flex-row items-start justify-between gap-4">
                      <CardTitle className="text-base font-semibold leading-snug">
                        {`${rowIndex + 1}. ${row[0]}`}
                      </CardTitle>
                      <CopyButton textToCopy={row[0]} />
                    </div>
                    <div className="text-xs">
                      {renderColumnBadges()}
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-2 pt-0">
                    {row.slice(1).map((cell, cellIndex) => (
                      <div key={cellIndex} className="aspect-[3/4]">
                        {renderImageCell(getImageDataByIndex(cell))}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden">
              <div>
                <VirtuosoGrid
                  ref={virtuosoRef}
                  useWindowScroll
                  totalCount={tableRows.length * tableHeaders.length}
                  overscan={1500}
                  rangeChanged={handleRangeChange}
                  components={gridComponents}
                  itemContent={(index) => {
                    const numCols = tableHeaders.length;
                    const rowIndex = Math.floor(index / numCols);
                    const colIndex = index % numCols;
                    const row = tableRows[rowIndex];

                    if (!row) return null;

                    const cell = row[colIndex];
                    const rowBg =
                      rowIndex % 2 !== 0 ? "bg-muted/20" : "bg-transparent";
                    const borderClass = "border-b border-border/50";

                    if (colIndex === 0) {
                      return (
                        <div
                          className={cn(
                            "flex items-center justify-center p-3 h-full",
                            rowBg,
                            borderClass
                          )}
                        >
                          <div className="text-center">
                            <div className="text-muted-foreground text-xs font-medium mb-1">
                              {rowIndex + 1}
                            </div>
                            <CopyBadge textToCopy={cell} />
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
          variant="default"
          size="icon"
          className={cn(
            "fixed bottom-8 right-8 z-50 rounded-full transition-all duration-300 shadow-lg",
            isScrolled
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10 pointer-events-none"
          )}
          onClick={scrollToTop}
          aria-label="返回顶部"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}