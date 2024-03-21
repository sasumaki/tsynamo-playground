import { forwardRef, useImperativeHandle, useRef } from "react";
import Editor from "@monaco-editor/react";
import { type editor } from "monaco-editor";
import { setupMonaco } from "../monaco/setupMonaco";

type TypeEditorProps = {
  onChange: () => void
}
type TouchHandle = {
  touch: () => void,
}

type MonacoEditor = editor.IStandaloneCodeEditor;
export const TypeEditor = forwardRef<TouchHandle, TypeEditorProps>(({ onChange }, forwardedRef) => {
  const editorRef = useRef<MonacoEditor | null>(null);

  function handleEditorDidMount(editor: MonacoEditor) {
    editorRef.current = editor;
  }
  useImperativeHandle(forwardedRef, () => ({
    touch: () => {
      editorRef?.current?.setValue(editorRef?.current?.getValue());
    }
  }), [])

  const defaultTypesValue = `
import { PartitionKey, SortKey } from "tsynamo";

export interface DDB {
   UserEvents: {
     userId: PartitionKey<string>;
     eventId: SortKey<number>;
     eventType: string;
     userAuthenticated: boolean;
   };
}
`

  return (
    <Editor
        height="100vh"
        defaultLanguage="typescript"
        defaultValue={defaultTypesValue}
        onMount={handleEditorDidMount}
        beforeMount={setupMonaco}
        theme='vs-dark'
        path='file:///type-editor/index.ts'
        onChange={onChange}
      />
  );
})
