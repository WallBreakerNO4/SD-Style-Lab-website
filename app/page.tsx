import fs from "fs";
import path from "path";
import { ModelCard } from "@/components/custom/ModelCard";
import {
  AiFillBilibili,
  AiFillGithub,
  AiFillBulb,
} from "react-icons/ai";

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
    <div className="container mx-auto p-4 sm:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">SD Style Lab</h1>
        <p className="text-muted-foreground mt-2">
          Explore and discover amazing Stable Diffusion models.
        </p>
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
            <p className="text-muted-foreground">No models found.</p>
          </div>
        )}
      </main>
      <footer className="text-center mt-12 py-4 border-t">
        <p className="text-sm text-muted-foreground">
          Created by{" "}
          <a
            href="https://blog.wall-breaker-no4.xyz/about/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            WallBreakerNO4
          </a>
        </p>
        <div className="flex justify-center gap-6 mt-4">
          <a
            href="https://github.com/WallBreakerNO4"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <AiFillGithub className="h-5 w-5" />
            <span className="text-sm">GitHub</span>
          </a>
          <a
            href="https://blog.wall-breaker-no4.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <AiFillBulb className="h-5 w-5" />
            <span className="text-sm">Blog</span>
          </a>
          <a
            href="https://space.bilibili.com/28978056"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <AiFillBilibili className="h-5 w-5" />
            <span className="text-sm">BiliBili</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
