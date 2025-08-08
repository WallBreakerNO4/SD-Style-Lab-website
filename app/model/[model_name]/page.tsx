import fs from "fs/promises";
import path from "path";
import Papa from "papaparse";
import { ModelClientPage, ModelData } from "@/components/custom/ModelTable";
import { notFound } from "next/navigation";

async function getModelData(modelName: string): Promise<ModelData | null> {
  try {
    const dataPath = path.join(
      process.cwd(),
      "public",
      "data",
      modelName
    );

    const modelInfoPath = path.join(dataPath, "model_info.json");
    const tablePath = path.join(dataPath, "sd_style_table.csv");
    const imagesPath = path.join(dataPath, "image_data.json");
    const commonPromptsPath = path.join(dataPath, "common_prompts.csv");

    const [modelInfoStr, tableCsvStr, imagesStr, commonPromptsCsvStr] = await Promise.all([
      fs.readFile(modelInfoPath, "utf-8"),
      fs.readFile(tablePath, "utf-8"),
      fs.readFile(imagesPath, "utf-8"),
      fs.readFile(commonPromptsPath, "utf-8"),
    ]);

    const modelInfo = JSON.parse(modelInfoStr);
    const imageData = JSON.parse(imagesStr);

    const parsedCsv = Papa.parse<string[]>(tableCsvStr.trim(), {
      header: false,
    });

    const tableHeaders = parsedCsv.data[0] || [];
    const tableRows = parsedCsv.data.slice(1).map((row) => {
      if (row[0]) {
        // Add a space after each comma that is not already followed by a space.
        row[0] = row[0].replace(/,(?!\s)/g, ", ");
      }
      return row;
    });

    const parsedCommonPrompts = Papa.parse<string[]>(commonPromptsCsvStr.trim(), {
      header: false,
    });

    const promptOrder = modelInfo.prompt_order || [];
    const commonPrompts = parsedCommonPrompts.data || [];

    return {
      modelInfo,
      imageData,
      tableHeaders,
      tableRows,
      promptOrder,
      commonPrompts,
    };
  } catch (error) {
    console.error(`Failed to load model data for ${modelName}:`, error);
    return null;
  }
}

type ModelPageProps = {
  params: Promise<{
    model_name: string;
  }>;
};

export default async function ModelPage({ params }: ModelPageProps) {
  const { model_name } = await params;
  const modelData = await getModelData(model_name);

  if (!modelData) {
    notFound();
  }

  return <ModelClientPage modelData={modelData} modelName={model_name} />;
}