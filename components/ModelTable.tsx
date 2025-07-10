"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { VirtuosoGrid } from "react-virtuoso";
import { ImageDialog } from "@/components/ImageDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ImageData {
  index: number;
  image_url: string;
  parameters: Record<string, any>;
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
}

export function ModelClientPage({ modelData }: ModelClientPageProps) {
  const { modelInfo, imageData, tableHeaders, tableRows } = modelData;
  const isMobile = useIsMobile();
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }

    const handleScroll = () => {
      if (headerRef.current) {
        const isScrolledPastHeader = window.scrollY > headerRef.current.offsetHeight;
        if (isHeaderExpanded && isScrolledPastHeader) {
          setIsHeaderExpanded(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHeaderExpanded]);

  const getImageDataByIndex = (indexStr: string): ImageData | undefined => {
    const index = parseInt(indexStr, 10);
    return imageData.find((img) => img.index === index);
  };

  const renderImageCell = (image: ImageData | undefined) => {
    if (!image) {
      return <div className="w-full aspect-[13/19] bg-gray-200 rounded-md" />;
    }
    return (
      <ImageDialog imageUrl={image.image_url} altText={`Image ${image.index}`}>
        <div className="relative w-full aspect-[13/19] cursor-pointer">
          <Image
            src={image.image_url}
            alt={`Image ${image.index}`}
            fill
            className="object-cover rounded-md"
          // unoptimized
          />
        </div>
      </ImageDialog>
    );
  };

  const headerStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  };

  const collapsedHeaderStyle: React.CSSProperties = {
    ...headerStyle,
    transform: `translateY(-${headerHeight - 60}px)`,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col h-screen">
      <div
        ref={headerRef}
        style={isHeaderExpanded ? headerStyle : collapsedHeaderStyle}
        className="bg-background pb-4"
      >
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">{modelInfo.title}</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
          >
            {isHeaderExpanded ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
        <p
          className={cn(
            "text-muted-foreground transition-opacity duration-300",
            { "opacity-0 h-0": !isHeaderExpanded }
          )}
        >
          {modelInfo.description.zh_CN}
        </p>
      </div>

      <div className="mt-6 flex-grow flex flex-col">
        {isMobile ? (
          <div className="space-y-4">
            {tableRows.map((row, rowIndex) => (
              <Card key={rowIndex}>
                <CardHeader>
                  <CardTitle>{row[0]}</CardTitle>
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
          <div className="flex-grow flex flex-col">
            <div className="grid grid-cols-6 gap-4 font-bold mb-2">
              {tableHeaders.map((header, index) => (
                <div key={index} className="text-center">
                  {header}
                </div>
              ))}
            </div>
            <div className="flex-grow">
              <VirtuosoGrid
                style={{ height: "100%" }}
                totalCount={tableRows.length * tableHeaders.length}
                overscan={1500}
                components={{
                  List: React.forwardRef<
                    HTMLDivElement,
                    { style?: React.CSSProperties; children?: React.ReactNode }
                  >(({ style, children }, ref) => (
                    <div
                      ref={ref}
                      style={style}
                      className="grid grid-cols-6 gap-4"
                    >
                      {children}
                    </div>
                  )),
                  Item: (props) => <div {...props} />,
                }}
                itemContent={(index) => {
                  const numCols = tableHeaders.length || 6;
                  const rowIndex = Math.floor(index / numCols);
                  const colIndex = index % numCols;
                  const row = tableRows[rowIndex];

                  if (!row) return null;

                  const cell = row[colIndex];

                  if (colIndex === 0) {
                    return (
                      <div className="flex items-center justify-center p-2 font-semibold text-center">
                        {cell}
                      </div>
                    );
                  }

                  return (
                    <div key={cell}>
                      {renderImageCell(getImageDataByIndex(cell))}
                    </div>
                  );
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}