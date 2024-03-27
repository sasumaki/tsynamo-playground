/* eslint-disable @typescript-eslint/no-explicit-any */
import Editor from "@monaco-editor/react";
import { type editor } from "monaco-editor";
import * as monaco from "monaco-editor";
import {
  MutableRefObject,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { setupMonaco } from "../monaco/setupMonaco";

type CodeEditorProps = {
  onChange: () => void;
  resultsRef?: MutableRefObject<{ execute: (ts: string) => void }>;
  valueFromUrl: string | null

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

/**
 * 
 * A \`Tsynamo\` instance with \`DDB\` type from \`type-editor\`.
 */
declare const ddb: import("tsynamo").Tsynamo<_DDB>;

const ddb = new Tsynamo<_DDB>({
  ddbClient: new PlaygroundDocumentClient()
})

${DELIMIT_HEADER}
import { DDB } from "./type-editor";

const eventType: DDB["UserEvents"]["eventType"] = "login"

await ddb
  .putItem("UserEvents")
  .item({
    userId: "123",
    eventId: 1,
    eventType,
  })
  .conditionExpression("userAuthenticated", "=", false)
  .execute();
`;

const findHeaderLineNumber = (code: string) =>
  code?.split("\n").findIndex((line) => line.includes(DELIMIT_HEADER)) + 1;

const getWholeSelection = (code: string) => {
  return {
    startLineNumber: findHeaderLineNumber(code) + 1,
    endLineNumber: 9999,
    startColumn: 1,
    endColumn: 9999,
  };
};
const keyListener = (e: monaco.IKeyboardEvent, editor: MonacoEditor) => {
  // prevent backspace from going to the hidden header of the code
  if (e.keyCode === 1) {
    const selection = editor.getSelection();
    if (!selection) {
      return;
    }
    if (
      selection.startLineNumber === selection.endLineNumber &&
      selection.startColumn === selection.endColumn &&
      selection.startLineNumber ===
        findHeaderLineNumber(editor.getValue()) + 1 &&
      selection.startColumn === 1
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
  // custom ctrl + a
  if (e.keyCode === 31 && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    e.stopPropagation();
    editor.setSelection(getWholeSelection(editor.getValue()));
  }
};

export const CodeEditor = forwardRef<TouchHandle, CodeEditorProps>(
  ({ onChange, resultsRef, valueFromUrl }, forwardedRef) => {
    const editorRef = useRef<MonacoEditor | null>(null);

    function handleEditorDidMount(editor: MonacoEditor) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (editor as any).setHiddenAreas([
        new monaco.Range(0, 0, findHeaderLineNumber(editor.getValue()), 0),
      ]);
      editor.onKeyDown((e) => keyListener(e, editor));

      editorRef.current = editor;
      resultsRef?.current?.execute(editor.getValue());
    }
    useImperativeHandle(
      forwardedRef,
      () => ({
        touch: () => {
          // have to reset hiddenAreas
          (editorRef.current as any).setHiddenAreas([
            new monaco.Range(0, 0, 0, 0),
          ]);
          const code = editorRef?.current?.getValue() ?? "";
          editorRef?.current?.setValue(code);

          (editorRef.current as any).setHiddenAreas([
            new monaco.Range(0, 0, findHeaderLineNumber(code), 0),
          ]);
        },
        getValue: () => {
          return editorRef.current?.getValue();
        },
        setValue: (val: string) => {
          editorRef?.current?.setValue(val)
        }
      }),
      []
    );

    return (
      <Editor
        height="100vh"
        width={"33%"}
        defaultLanguage="typescript"
        defaultValue={valueFromUrl ?? defaultCodeValue}
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
