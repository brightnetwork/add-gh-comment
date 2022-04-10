import * as ejs from "ejs";

export const render = (
  template: string,
  data: Record<string, unknown>,
): Promise<string> => ejs.renderFile(template, data);
