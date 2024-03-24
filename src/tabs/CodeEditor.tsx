/* eslint-disable @typescript-eslint/no-explicit-any */
import Editor from "@monaco-editor/react";
import { type editor } from "monaco-editor";
import * as monaco from "monaco-editor";
import { MutableRefObject, forwardRef, useImperativeHandle, useRef } from "react";
import { setupMonaco } from "../monaco/setupMonaco";

type CodeEditorProps = {
  onChange?: () => void;
  resultsRef?: MutableRefObject<{ execute: (ts: string) => void}>
};
type TouchHandle = {
  touch: () => void;
};
type MonacoEditor = editor.IStandaloneCodeEditor;

const DELIMIT_HEADER = "/* DELIMIT_HEADER */";
const defaultCodeValue = `
class PlaygroundDocumentClient {
  constructor() {}
  
  async send(args: unknown) {
    window.dispatchEvent(new CustomEvent("playground", { detail: args }));
    return new Proxy({}, { get: () => []});
  }
}
  
import { Tsynamo } from "tsynamo"
import { DDB as _DDB } from "./type-editor";

const ddb = new Tsynamo<_DDB>({
  ddbClient: new PlaygroundDocumentClient()
})

${DELIMIT_HEADER}
import { DDB } from "./type-editor";

await ddb
  .getItem("UserEvents")
  .keys({
    userId: "123",
    eventId: 222,
  })
  .attributes(["userId"])
  .execute();  
`;

const findHeaderLineNumber = (code: string) => code?.split("\n").findIndex((line) => line.includes(DELIMIT_HEADER)) + 1 ?? 0;

export const CodeEditor = forwardRef<TouchHandle, CodeEditorProps>(
  ({ onChange, resultsRef }, forwardedRef) => {
    const editorRef = useRef<MonacoEditor | null>(null);

    function handleEditorDidMount(editor: MonacoEditor) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (editor as any).setHiddenAreas([
        new monaco.Range(0, 0, findHeaderLineNumber(editor.getValue()), 0),
      ]);
      editorRef.current = editor;
      resultsRef?.current?.execute(editor.getValue())
    }
    useImperativeHandle(
      forwardedRef,
      () => ({
        
        touch: () => {
          // have to reset hiddenAreas
          (editorRef.current as any).setHiddenAreas([
            new monaco.Range(
              0,
              0,
              0,
              0
            ),
          ]);
          const code = editorRef?.current?.getValue() ?? "";
          editorRef?.current?.setValue(code);

          (editorRef.current as any).setHiddenAreas([
            new monaco.Range(
              0,
              0,
              findHeaderLineNumber(code),
              0
            ),
          ]);
        },
        getValue: () => {
          return editorRef.current?.getValue();
        },
        mounted: () => editorRef.current,
      }),
      []
    );

    return (
      <Editor
        height="100vh"
        width={"33%"}
        defaultLanguage="typescript"
        defaultValue={defaultCodeValue}
        onMount={handleEditorDidMount}
        beforeMount={setupMonaco}
        theme="vs-dark"
        path="file:///index.ts"
        onChange={onChange}
        options={{
          automaticLayout: true,
          lineNumbers: "off",
          minimap: { enabled: false },
          glyphMargin: false,
          folding: false,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 0,
          showFoldingControls: "never",
          overviewRulerLanes: 0,
          theme: "vs-dark",
          padding: { top: 2 },
          contextmenu: false,
          scrollbar: {
            verticalScrollbarSize: 4,
            verticalSliderSize: 4,
            useShadows: false,
          },
        }}
      />
    );
  }
);
