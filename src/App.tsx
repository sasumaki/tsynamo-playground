
import { useRef } from 'react';
import Editor from '@monaco-editor/react';
import  { type editor  } from 'monaco-editor';
import { AppContainer, EditorsTabs } from './styles/styledComponents';
import { setupMonaco } from './monaco/setupMonaco';

type MonacoEditor = editor.IStandaloneCodeEditor
function App() {
  const editorRef = useRef<editor.IStandaloneCodeEditor
  | null>(null)

  function handleEditorDidMount(editor: MonacoEditor) {
      editorRef.current = editor;
    }

  const defaultValue = `
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
  <>
    <AppContainer>
     
       <Editor
        height="100vh"
        defaultLanguage="typescript"
        defaultValue={defaultValue}
        onMount={handleEditorDidMount}
        beforeMount={setupMonaco}
        theme='vs-dark'
        path='file:///index.ts'
      />

    </AppContainer>
    </>
  );
}

export default App
