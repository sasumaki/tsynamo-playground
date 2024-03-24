import { Monaco } from "../util/types";
import { MonacoUtils } from "./MonacoUtils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setupMonaco = async (monaco: Monaco) => {
  const monacoUtils = new MonacoUtils(monaco);
  await monacoUtils.init();
  const res = await fetch(
    "https://cdn.jsdelivr.net/gh/sasumaki/minified-tsynamo/dist/main/index.d.ts"
  );

  if (!res.ok) throw new Error("fucked");

  const data = await res.text();

  await monacoUtils.addLib(`file:///node_modules/tsynamo/index.d.ts`, data);
};
