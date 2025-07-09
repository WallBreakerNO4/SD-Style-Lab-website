"use client";

import Image from "next/image";
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  return (
    <Card key={model.model_name} className="flex flex-col p-0 gap-0">
      <div className="aspect-[4/5] relative w-full">
        <Image
          src={model.cover_image}
          alt={`Cover image for ${model.title}`}
          fill
          className="object-cover rounded-t-lg"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <CardHeader className="pt-6">
        <CardTitle>{model.title}</CardTitle>
        {/* <Badge variant="secondary" className="w-fit mt-1">
          {model.model_name}
        </Badge> */}
        <div className="pt-2">
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {model.description.zh_CN}
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs"
              >
                查看详情
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>{model.title}</DialogTitle>
                <DialogDescription className="whitespace-pre-wrap max-h-[70vh] overflow-y-auto">
                  {model.description.zh_CN}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <div className="mt-auto">
        <div className="px-6">
          <Separator />
        </div>
        <CardContent className="pt-4">
          {model.sample_images && model.sample_images.length > 0 && (
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full relative"
            >
              <CarouselContent className="-ml-1">
                {model.sample_images.map((img, index) => (
                  <CarouselItem key={index} className="basis-11/30 pl-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="aspect-[3/4] relative cursor-pointer">
                          <Image
                            src={img}
                            alt={`Sample image ${index + 1} for ${model.title
                              }`}
                            fill
                            className="object-cover rounded-md"
                            sizes="15vw"
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent
                        showCloseButton={false}
                        unpadded={true}
                        className="w-auto h-auto max-w-[90vw] max-h-[90vh] flex items-center justify-center"
                      >
                        <DialogHeader className="sr-only">
                          <DialogTitle>
                            {`Sample image ${index + 1} for ${model.title}`}
                          </DialogTitle>
                          <DialogDescription>
                            A larger view of the sample image.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="relative w-auto h-auto max-w-full max-h-full">
                          <Image
                            src={img}
                            alt={`Sample image ${index + 1} for ${model.title
                              }`}
                            width={1920}
                            height={1080}
                            className="object-contain w-auto h-auto max-w-full max-h-[85vh]"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-1 top-1/2 -translate-y-1/2" />
              <CarouselNext className="absolute right-1 top-1/2 -translate-y-1/2" />
            </Carousel>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-4 pb-6">
          {model.huggingface_url && (
            <Button asChild variant="outline" size="sm">
              <a
                href={model.huggingface_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Image
                  src="/huggingface-color.svg"
                  alt="Hugging Face"
                  width={16}
                  height={16}
                  unoptimized
                />
                <span>Hugging Face</span>
              </a>
            </Button>
          )}
          {model.civitai_url && (
            <Button asChild variant="outline" size="sm">
              <a
                href={model.civitai_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Image
                  src="/civitai-color.svg"
                  alt="Civitai"
                  width={16}
                  height={16}
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