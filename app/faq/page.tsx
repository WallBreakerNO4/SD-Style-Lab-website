import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ModeToggle } from "@/components/custom/mode-toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, HelpCircle, BookOpen, Sparkles, Users, Zap } from "lucide-react";

const faqData = [
  {
    question: "什么是 SD Style Lab？",
    answer: "SD Style Lab 是一个用于对比和探索各种 Stable Diffusion 模型画风的实验平台。我们收集整理了大量优秀的模型，通过统一的测试图片和提示词，让您能够直观地看到不同模型在相同条件下的表现差异，帮助您找到最适合自己需求的模型。",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    question: "如何使用这个网站？",
    answer: "使用非常简单！1. 浏览主页上的模型卡片，查看每个模型的简介和示例图片；2. 点击感兴趣的模型卡片，进入详情页面；3. 在详情页面可以看到该模型的多张测试图片，以及常用的提示词和参数设置；4. 通过对比不同模型的相同测试图片，找到最适合您需求的模型。",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    question: "测试图片是如何生成的？",
    answer: "我们使用统一的测试提示词和参数设置，在每个模型上生成相同的测试图片。这样可以确保比较的公平性。测试内容包括：基础人物、动漫风格、写实风格、建筑场景等多种类型，涵盖了日常使用中的常见需求。",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    question: "如何获取这些模型？",
    answer: "每个模型详情页面都提供了获取链接。我们主要支持两种获取方式：1. Hugging Face - 适合直接下载模型文件；2. Civitai - 提供详细的模型介绍和社区评价。点击对应的链接即可跳转到相应平台。",
    icon: <HelpCircle className="h-5 w-5" />,
  },
  {
    question: "我可以贡献模型吗？",
    answer: "当然可以！如果您发现了优秀的模型想要分享给大家，可以通过以下方式：1. 在我们的 GitHub 仓库提交 Issue；2. 提供模型的基本信息、测试图片和提示词；3. 我们会验证并整理后添加到平台中。欢迎一起丰富这个实验平台！",
    icon: <Users className="h-5 w-5" />,
  },
  {
    question: "为什么有些模型显示效果不好？",
    answer: "模型效果可能受到多种因素影响：1. 提示词质量 - 不同模型对提示词的理解能力不同；2. 参数设置 - 采样步数、CFG值等参数会影响最终效果；3. 模型特点 - 每个模型都有自己的擅长领域；4. 测试条件 - 我们使用的是通用设置，可能不是该模型的最佳配置。建议您在本地环境中进一步调优。",
    icon: <HelpCircle className="h-5 w-5" />,
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              常见问题
            </h1>
            <p className="text-muted-foreground mt-2">
              了解如何使用 SD Style Lab
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <ModeToggle />
          </div>
        </header>

        <main>
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                返回首页
              </Button>
            </Link>
          </div>

          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <HelpCircle className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">有什么可以帮助您的吗？</h2>
              <p className="text-muted-foreground">
                这里收集了一些常见问题，如果您还有其他疑问，欢迎联系我们
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {faqData.map((item, index) => (
                <AccordionItem key={`item-${index}`} value={`item-${index}`}>
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="text-primary">
                        {item.icon}
                      </div>
                      <span className="text-lg font-medium">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground leading-relaxed pl-8">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-12 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-border/50">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                还有问题？
              </h3>
              <p className="text-muted-foreground mb-4">
                如果您在网站上遇到问题，或者有其他建议，欢迎通过以下方式联系我们：
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://github.com/WallBreakerNO4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
                >
                  GitHub Issues
                </a>
                <a
                  href="https://blog.wall-breaker-no4.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
                >
                  博客留言
                </a>
                <a
                  href="https://space.bilibili.com/28978056"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
                >
                  B站私信
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}