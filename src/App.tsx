/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from "react";
import { CodeEditor } from "./editors/CodeEditor";
import { TypeEditor } from "./editors/TypeEditor";
import { AppContainer } from "./styles/styledComponents";
import debounce from "lodash.debounce"

const DEBOUNCE_TIME = 200
function App() {
  const codeEditorRef = useRef<any>(null);
  const typeEditorRef = useRef<any>(null);

  const onTypeEditorChange = useRef(
    debounce(() => {
      if (codeEditorRef.current) {
        codeEditorRef.current.touch();
      }
    }, DEBOUNCE_TIME)
  ).current;

  const handleTypeEditorOnChange = () => {
    onTypeEditorChange()
  };

  return (
    <>
      <AppContainer>
        <TypeEditor ref={typeEditorRef} onChange={handleTypeEditorOnChange} />
        <CodeEditor ref={codeEditorRef} />
      </AppContainer>
    </>
  );
}

export default App;
