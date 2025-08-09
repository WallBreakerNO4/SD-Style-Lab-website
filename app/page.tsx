import fs from "fs";
import path from "path";
import { ModelCard } from "@/components/custom/ModelCard";
import {
  AiFillBilibili,
  AiFillGithub,
  AiFillBulb,
} from "react-icons/ai";
import { PageHeader } from "@/components/custom/page-header";
import Link from "next/link";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 relative">

      <div className="container mx-auto px-4 py-8 relative z-10">
        <PageHeader>
          <div className="text-center space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              SD Style Lab
            </h1>
            <p className="text-muted-foreground text-xl md:text-2xl font-medium">
              探索与发现优秀的 Stable Diffusion 模型
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground/80">
              <div className="w-2 h-2 rounded-full bg-primary/60" />
              <span>精选模型 · 风格对比 · 视觉享受</span>
              <div className="w-2 h-2 rounded-full bg-primary/60" />
            </div>
          </div>
        </PageHeader>

        <main>
          {models.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-6">
              {models.map((model, index) => (
                <div key={model.model_name}>
                  <ModelCard model={model} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="max-w-md mx-auto">
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center backdrop-blur-sm border border-border/20">
                    <svg className="w-16 h-16 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">暂无模型</h3>
                <p className="text-muted-foreground text-lg">当前没有找到可用的模型数据</p>
              </div>
            </div>
          )}
        </main>

        <footer className="text-center mt-20 py-12 border-t border-gradient-to-r from-transparent via-border/60 to-transparent relative">
          <div className="absolute inset-0 bg-gradient-to-t from-muted/10 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <p className="text-sm text-muted-foreground mb-6">
              由{" "}
              <a
                href="https://blog.wall-breaker-no4.xyz/about/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent hover:from-primary/80 hover:to-primary/60 transition-all duration-300 underline underline-offset-4 decoration-primary/40"
              >
                WallBreakerNO4
              </a>{" "}
              用心创建
            </p>
            
            <div className="flex justify-center gap-8 mb-6">
              <a
                href="https://github.com/WallBreakerNO4"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                <div className="p-2 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors duration-300">
                  <AiFillGithub className="h-5 w-5 group-hover:text-primary transition-colors duration-300" />
                </div>
                <span className="text-sm font-medium">GitHub</span>
              </a>
              <a
                href="https://blog.wall-breaker-no4.xyz/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                <div className="p-2 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors duration-300">
                  <AiFillBulb className="h-5 w-5 group-hover:text-primary transition-colors duration-300" />
                </div>
                <span className="text-sm font-medium">Blog</span>
              </a>
              <a
                href="https://space.bilibili.com/28978056"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                <div className="p-2 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors duration-300">
                  <AiFillBilibili className="h-5 w-5 group-hover:text-primary transition-colors duration-300" />
                </div>
                <span className="text-sm font-medium">BiliBili</span>
              </a>
            </div>

            <div className="flex justify-center">
              <Link 
                href="/faq" 
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 rounded-full border border-primary/20 hover:border-primary/40 hover:bg-primary/5 backdrop-blur-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                常见问题
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
