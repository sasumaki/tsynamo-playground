import { MonacoUtils } from "./MonacoUtils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setupMonaco = async (monaco: any) => {
  console.log("bruh");

  await MonacoUtils.init(monaco);
  const res = await fetch("https://unpkg.com/tsynamo/dist/index.d.ts");
  if (!res.ok) throw new Error("fucked");

  const data = await res.text();

  await MonacoUtils.addLib(
    `file:///node_modules/tsynamo/index.d.ts`,
    data,
    monaco
  );

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dependencies: any = {
    "type-editor": "*",
  };
  await MonacoUtils.addLib(
    "file:///package.json",
    JSON.stringify({
      dependencies,
    }),
    monaco
  );
};
