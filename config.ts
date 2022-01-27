import { isAbsolute, join } from "./deps.ts";

interface TerConfig {
  inputPath: string;
  outputPath: string;
  assetsPath: string;
  viewsPath: string;
  title: string;
  description: string;
  ignoreKeys: Array<string>;
}

const defaultConfig: TerConfig = {
  inputPath: Deno.cwd(),
  outputPath: "_site",
  assetsPath: "_assets",
  viewsPath: "_views",
  title: "Ter wiki",
  description: "A tiny wiki-style site builder with Zettelkasten flavor",
  ignoreKeys: ["private", "draft"],
};

export function createConfig(args?: Array<string>): TerConfig {
  const config = defaultConfig;

  if (args && args[0]) {
    const inputPath = Deno.args[0];
    config.inputPath = isAbsolute(inputPath)
      ? inputPath
      : join(Deno.cwd(), inputPath);
  }

  if (args && args[1]) {
    const outputPath = Deno.args[1];
    config.outputPath = isAbsolute(outputPath)
      ? outputPath
      : join(Deno.cwd(), outputPath);
  }

  return config;
}
