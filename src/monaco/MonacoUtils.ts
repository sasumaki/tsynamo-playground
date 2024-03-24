/* eslint-disable @typescript-eslint/no-explicit-any */
import { loader } from "@monaco-editor/react";
import * as m from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

type Monaco = typeof m;
export class MonacoUtils {
  monaco: Monaco;
  constructor(m: Monaco) {
    this.monaco = m;
  }
  async init() {
    self.MonacoEnvironment = {
      getWorker(_, label) {
        if (label === "json") {
          return new jsonWorker();
        }
        if (label === "css" || label === "scss" || label === "less") {
          return new cssWorker();
        }
        if (label === "html" || label === "handlebars" || label === "razor") {
          return new htmlWorker();
        }
        if (label === "typescript" || label === "javascript") {
          return new tsWorker();
        }
        return new editorWorker();
      },
    };

    loader.config({ monaco: this.monaco });

    await loader.init();

    this.monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      moduleResolution:
        this.monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: this.monaco.languages.typescript.ModuleKind.ESNext,
      target: this.monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      strict: true,
      noImplicitAny: true,
    });
  }
  async addLib(filePath: string | undefined, value: string) {
    this.monaco.languages.typescript.typescriptDefaults.addExtraLib(
      value,
      filePath
    );
  }
}
