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
    }
  }), [])
  
  const defaultCodeValue = `
  import { Tsynamo } from "tsynamo"
  import { DDB } from "./type-editor";
  
  const tsynamoClient = new Tsynamo<DDB>({
    ddbClient: {} // some real documentClient
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
    />
  );
});
