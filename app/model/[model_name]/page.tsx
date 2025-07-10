import fs from "fs/promises";
import path from "path";
import Papa from "papaparse";
import { ModelClientPage, ModelData } from "@/components/ModelTable";
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

    const [modelInfoStr, tableCsvStr, imagesStr] = await Promise.all([
      fs.readFile(modelInfoPath, "utf-8"),
      fs.readFile(tablePath, "utf-8"),
      fs.readFile(imagesPath, "utf-8"),
    ]);

    const modelInfo = JSON.parse(modelInfoStr);
    const imageData = JSON.parse(imagesStr);

    const parsedCsv = Papa.parse<string[]>(tableCsvStr.trim(), {
      header: false,
    });

    const tableHeaders = parsedCsv.data[0] || [];
    const tableRows = parsedCsv.data.slice(1);

    return {
      modelInfo,
      imageData,
      tableHeaders,
      tableRows,
    };
  } catch (error) {
    console.error(`Failed to load model data for ${modelName}:`, error);
    return null;
  }
}

export default async function ModelPage({
  params,
}: {
  params: { model_name: string };
}) {
  const { model_name } = await params;
  const modelData = await getModelData(model_name);

  if (!modelData) {
    notFound();
  }

  return <ModelClientPage modelData={modelData} />;
}