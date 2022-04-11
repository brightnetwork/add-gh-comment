import Mustache from "mustache";
import * as fs from "fs";

export const render = async (
  templatePath: string,
  data: Record<string, unknown>,
): Promise<string> =>
  Mustache.render(fs.readFileSync(templatePath).toString(), data);
