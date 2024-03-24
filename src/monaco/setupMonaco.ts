import { MonacoUtils } from "./MonacoUtils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setupMonaco = async (monaco: any) => {
  const monacoUtils = new MonacoUtils(monaco);
  await monacoUtils.init();
  const res = await fetch(
    "https://cdn.jsdelivr.net/gh/sasumaki/minified-tsynamo/dist/main/index.d.ts"
  );

  if (!res.ok) throw new Error("fucked");

  const data = await res.text();

  await monacoUtils.addLib(`file:///node_modules/tsynamo/index.d.ts`, data);

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dependencies: any = {
    "type-editor": "*",
  };
  await monacoUtils.addLib(
    "file:///package.json",
    JSON.stringify({
      dependencies,
    })
  );
};
