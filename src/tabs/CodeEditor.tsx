import Editor from "@monaco-editor/react";
import { type editor } from "monaco-editor";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { setupMonaco } from "../monaco/setupMonaco";

type CodeEditorProps = {
  onChange?: () => void
}
type TouchHandle = {
  touch: () => void,
}
type MonacoEditor = editor.IStandaloneCodeEditor;

export const CodeEditor = forwardRef<TouchHandle, CodeEditorProps>(({ onChange }, forwardedRef) => {
  const editorRef = useRef<MonacoEditor | null>(null);

  function handleEditorDidMount(editor: MonacoEditor) {
    editorRef.current = editor;
  }
  useImperativeHandle(forwardedRef, () => ({
    touch: () => {
      editorRef?.current?.setValue(editorRef?.current?.getValue());
    },
    getValue: () => {
      return editorRef.current?.getValue()
    },
    mounted: () => editorRef.current
  }), [])
  
  const defaultCodeValue = `
class PlaygroundDocumentClient {
  constructor() {}
  
  async send(args: unknown) {
    console.log(args)
    window.dispatchEvent(new CustomEvent("playground", { detail: args }));

    return { Item: {}, Items: [], Attributes: [] };
  }
}
  
import { Tsynamo } from "tsynamo"
import { DDB } from "./type-editor";

const tsynamoClient = new Tsynamo<DDB>({
  ddbClient: new PlaygroundDocumentClient()
})
  
await tsynamoClient
  .getItem("UserEvents")
  .keys({
    userId: "123",
    eventId: 222,
  })
  .attributes(["userId"])
  .execute();  
`;
  return (
    <Editor
      height="100vh"
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
});
