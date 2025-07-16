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
      className="group flex flex-col p-0 gap-0 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 border-border/50"
      onClick={handleCardClick}
    >
      <div className="aspect-[4/5] relative w-full overflow-hidden">
        <Image
          src={model.cover_image}
          alt={`Cover image for ${model.title}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardHeader className="pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {model.title}
          </CardTitle>
          <Badge
            variant="secondary"
            className="text-xs shrink-0 bg-primary/10 text-primary hover:bg-primary/20"
          >
            {model.model_name}
          </Badge>
        </div>

        <div className="pt-2">
          <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">
            {model.description.zh_CN}
          </p>
          <Dialog onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 mt-2 text-xs text-primary font-medium"
                onClick={stopPropagation}
              >
                查看详情 →
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
        <div className="px-4">
          <Separator className="bg-border/50" />
        </div>

        <CardContent className="pt-3 pb-4">
          {model.sample_images && model.sample_images.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">示例图片</p>
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
                            <div className="aspect-[3/4] relative cursor-pointer rounded-md overflow-hidden">
                              <Image
                                src={img}
                                alt={`Sample image ${index + 1} for ${model.title}`}
                                fill
                                className="object-cover rounded-md transition-transform duration-300 hover:scale-105"
                                sizes="10vw"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                            </div>
                          </ImageDialog>
                        </Dialog>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {model.sample_images.length > 3 && (
                  <>
                    <CarouselPrevious className="absolute -left-2 top-1/2 -translate-y-1/2 h-6 w-6 bg-background/80 backdrop-blur-sm border-border/50" />
                    <CarouselNext className="absolute -right-2 top-1/2 -translate-y-1/2 h-6 w-6 bg-background/80 backdrop-blur-sm border-border/50" />
                  </>
                )}
              </Carousel>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex gap-2 pt-0 pb-4 px-4">
          {model.huggingface_url && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              onClick={stopPropagation}
              className="flex-1 h-8 text-xs bg-primary/5 hover:bg-primary/10"
            >
              <a
                href={model.huggingface_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <Image
                  src="/huggingface-color.svg"
                  alt="Hugging Face"
                  width={14}
                  height={14}
                  unoptimized
                />
                <span>Hugging Face</span>
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
                "flex-1 h-8 text-xs bg-primary/5 hover:bg-primary/10",
                model.huggingface_url && "flex-none"
              )}
            >
              <a
                href={model.civitai_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <Image
                  src="/civitai-color.svg"
                  alt="Civitai"
                  width={14}
                  height={14}
                  unoptimized
                />
                <span>Civitai</span>
              </a>
            </Button>
          )}
        </CardFooter>
      </div>
    </Card>
  );
}