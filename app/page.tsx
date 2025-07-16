import fs from "fs";
import path from "path";
import { ModelCard } from "@/components/custom/ModelCard";
import {
  AiFillBilibili,
  AiFillGithub,
  AiFillBulb,
} from "react-icons/ai";
import { ModeToggle } from "@/components/custom/mode-toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

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

async function getModels(): Promise<ModelInfo[]> {
  const dataDirectory = path.join(process.cwd(), "public/data");
  try {
    const modelDirectories = fs
      .readdirSync(dataDirectory, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    const models = modelDirectories.map((dir) => {
      const infoPath = path.join(dataDirectory, dir, "model_info.json");
      if (fs.existsSync(infoPath)) {
        const fileContent = fs.readFileSync(infoPath, "utf-8");
        return JSON.parse(fileContent) as ModelInfo;
      }
      return null;
    });

    return models.filter((model): model is ModelInfo => model !== null);
  } catch (error) {
    console.error("Failed to read model data:", error);
    return [];
  }
}

export default async function Home() {
  const models = await getModels();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              SD Style Lab
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              探索与发现优秀的 Stable Diffusion 模型
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-2">
            <Link href="/faq">
              <Button variant="ghost" size="sm" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                帮助
              </Button>
            </Link>
            <ModeToggle />
          </div>
        </header>

        <main>
          {models.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {models.map((model) => (
                <ModelCard key={model.model_name} model={model} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">暂无模型</h3>
                <p className="text-muted-foreground">当前没有找到可用的模型数据</p>
              </div>
            </div>
          )}
        </main>

        <footer className="text-center mt-16 py-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            由{" "}
            <a
              href="https://blog.wall-breaker-no4.xyz/about/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
            >
              WallBreakerNO4
            </a>{" "}
            创建
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <a
              href="https://github.com/WallBreakerNO4"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <AiFillGithub className="h-5 w-5" />
              <span className="text-sm">GitHub</span>
            </a>
            <a
              href="https://blog.wall-breaker-no4.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <AiFillBulb className="h-5 w-5" />
              <span className="text-sm">Blog</span>
            </a>
            <a
              href="https://space.bilibili.com/28978056"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <AiFillBilibili className="h-5 w-5" />
              <span className="text-sm">BiliBili</span>
            </a>
          </div>
          <div className="mt-4">
            <Link href="/faq" className="text-sm text-primary hover:text-primary/80 transition-colors underline underline-offset-4">
              常见问题
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
