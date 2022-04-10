import * as path from "path";
import * as ejs from "ejs";

export const render = (
  template: string,
  data: Record<string, unknown>,
): Promise<string> =>
  ejs.renderFile(path.join("/github/workspace", template), data);
