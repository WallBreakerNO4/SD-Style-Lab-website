"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ImageDialog } from "./ImageDialog";
import { cn } from "@/lib/utils";

interface ModelInfo {
  title: string;
  model_name: string;
  description: {
    en_US: string;
    zh_CN: string;
  };
  huggingface_url?: string;
  civitai_url?: string;
  cover_image: string;
  sample_images: string[];
}

interface ModelCardProps {
  model: ModelInfo;
}

export function ModelCard({ model }: ModelCardProps) {
  const router = useRouter();
  const ignoreNextClick = useRef(false);

  const handleCardClick = () => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    router.push(`/model/${model.model_name}`);
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      ignoreNextClick.current = true;
    }
  };

  return (
    <Card
      key={model.model_name}
      className="group flex flex-col p-0 gap-0 cursor-pointer overflow-hidden transition-shadow duration-300 hover:shadow-lg border-border/30 bg-background/50 backdrop-blur-sm hover:bg-background/80 hover:border-primary/30"
      onClick={handleCardClick}
    >
      <div className="aspect-[4/5] relative w-full overflow-hidden">
        <Image
          src={model.cover_image}
          alt={`Cover image for ${model.title}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>

      <CardHeader className="pt-5 pb-4 relative">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-xl font-bold line-clamp-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/80 transition-colors duration-300">
            {model.title}
          </CardTitle>
          <Badge
            variant="secondary"
            className="text-xs shrink-0 bg-gradient-to-r from-primary/15 to-secondary/15 text-primary border-primary/20 hover:from-primary/25 hover:to-secondary/25 transition-colors duration-300 backdrop-blur-sm"
          >
            {model.model_name}
          </Badge>
        </div>

        <div className="pt-3">
          <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed group-hover:text-muted-foreground/90 transition-colors duration-300">
            {model.description.zh_CN}
          </p>
          <Dialog onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 mt-3 text-xs text-primary font-medium hover:text-primary/80 transition-colors duration-300 group/button"
                onClick={stopPropagation}
              >
                <span>查看详情</span>
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[625px] max-h-[80vh]"
              onClick={stopPropagation}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl">{model.title}</DialogTitle>
                <DialogDescription className="whitespace-pre-wrap text-sm leading-relaxed mt-4 overflow-y-auto">
                  {model.description.zh_CN}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <div className="mt-auto">
        <div className="px-5">
          <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />
        </div>

        <CardContent className="pt-4 pb-5">
          {model.sample_images && model.sample_images.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
                <p className="text-xs font-medium text-muted-foreground">示例图片</p>
              </div>
              <Carousel
                opts={{
                  align: "start",
                }}
                className="w-full relative"
              >
                <CarouselContent className="-ml-1">
                  {model.sample_images.slice(0, 3).map((img, index) => (
                    <CarouselItem key={index} className="basis-1/3 pl-1">
                      <div onClick={stopPropagation}>
                        <Dialog onOpenChange={onOpenChange}>
                          <ImageDialog
                            imageUrl={img}
                            altText={`Sample image ${index + 1} for ${model.title}`}
                          >
                            <div className="aspect-[3/4] relative cursor-pointer rounded-lg overflow-hidden group/img border border-border/30">
                              <Image
                                src={img}
                                alt={`Sample image ${index + 1} for ${model.title}`}
                                fill
                                className="object-cover transition-transform duration-300 group-hover/img:scale-105"
                                sizes="10vw"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />
                              <div className="absolute inset-0 ring-1 ring-primary/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 rounded-lg" />
                            </div>
                          </ImageDialog>
                        </Dialog>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {model.sample_images.length > 3 && (
                  <>
                    <CarouselPrevious className="absolute -left-3 top-1/2 -translate-y-1/2 h-7 w-7 bg-background/90 backdrop-blur-md border-border/30 shadow-lg hover:bg-background hover:border-primary/30 transition-all duration-300" />
                    <CarouselNext className="absolute -right-3 top-1/2 -translate-y-1/2 h-7 w-7 bg-background/90 backdrop-blur-md border-border/30 shadow-lg hover:bg-background hover:border-primary/30 transition-all duration-300" />
                  </>
                )}
              </Carousel>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex gap-3 pt-0 pb-5 px-5">
          {model.huggingface_url && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              onClick={stopPropagation}
              className="flex-1 h-9 text-xs bg-gradient-to-r from-primary/8 to-secondary/8 hover:from-primary/15 hover:to-secondary/15 border border-primary/20 hover:border-primary/30 transition-colors duration-300 backdrop-blur-sm"
            >
              <a
                href={model.huggingface_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 group/link"
              >
                <Image
                  src="/huggingface-color.svg"
                  alt="Hugging Face"
                  width={16}
                  height={16}
                  unoptimized
                />
                <span className="font-medium">Hugging Face</span>
              </a>
            </Button>
          )}
          {model.civitai_url && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              onClick={stopPropagation}
              className={cn(
                "flex-1 h-9 text-xs bg-gradient-to-r from-primary/8 to-secondary/8 hover:from-primary/15 hover:to-secondary/15 border border-primary/20 hover:border-primary/30 transition-colors duration-300 backdrop-blur-sm",
                model.huggingface_url && "flex-none"
              )}
            >
              <a
                href={model.civitai_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 group/link"
              >
                <Image
                  src="/civitai-color.svg"
                  alt="Civitai"
                  width={16}
                  height={16}
                  unoptimized
                />
                <span className="font-medium">Civitai</span>
              </a>
            </Button>
          )}
        </CardFooter>
      </div>
    </Card>
  );
}