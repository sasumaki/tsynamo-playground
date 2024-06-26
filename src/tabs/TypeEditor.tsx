import { forwardRef, useImperativeHandle, useRef } from "react";
import Editor from "@monaco-editor/react";
import { type editor } from "monaco-editor";
import { setupMonaco } from "../monaco/setupMonaco";

type TypeEditorProps = {
  onChange: () => void
  valueFromUrl: string | null
}
type TouchHandle = {
  touch: () => void,
}

type MonacoEditor = editor.IStandaloneCodeEditor;
export const TypeEditor = forwardRef<TouchHandle, TypeEditorProps>(({ onChange, valueFromUrl }, forwardedRef) => {
  const editorRef = useRef<MonacoEditor | null>(null);

  function handleEditorDidMount(editor: MonacoEditor) {
    editorRef.current = editor;
  }
  useImperativeHandle(forwardedRef, () => ({
    touch: () => {
      editorRef?.current?.setValue(editorRef?.current?.getValue());
    },
    getValue: () => {
      return editorRef?.current?.getValue()
    },
    setValue: (val: string) => {
      editorRef?.current?.setValue(val)
    }
  }), [])

  const defaultTypesValue = `
import { PartitionKey, SortKey } from "tsynamo";

export interface DDB {
  UserEvents: {
    userId: PartitionKey<string>;
    eventId: SortKey<number>;
    eventType: "LOG_IN" | "SIGN_IN";
    userAuthenticated: boolean;
  };
}
`

  return (
    <Editor
        height="100vh"
        width={"33%"}
        defaultLanguage="typescript"
        defaultValue={valueFromUrl ?? defaultTypesValue}
        onMount={handleEditorDidMount}
        beforeMount={setupMonaco}
        theme='vs-dark'
        path='file:///type-editor/index.ts'
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
          theme:"vs-dark",
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
})
