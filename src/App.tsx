/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from "react";
import { CodeEditor } from "./tabs/CodeEditor";
import { TypeEditor } from "./tabs/TypeEditor";
import { AppContainer } from "./styles/styledComponents";
import debounce from "lodash.debounce"
import { Results } from "./tabs/Results";

const DEBOUNCE_TIME = 200
function App() {
  const codeEditorRef = useRef<any>(null);
  const resultsRef = useRef<any>(null);

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
  const onCodeEditorChange = useRef(
    debounce(() => {
      if (resultsRef.current) {
        resultsRef.current.execute(codeEditorRef.current?.getValue());
      }
    }, DEBOUNCE_TIME)
  ).current;

  const handleCodeEditorChange = () => {
    onCodeEditorChange()
  };

  return (
    <>
      <AppContainer>
        <TypeEditor onChange={handleTypeEditorOnChange} />
        <CodeEditor ref={codeEditorRef} onChange={handleCodeEditorChange} resultsRef={resultsRef}/>
        <Results ref={resultsRef} />
      </AppContainer>
    </>
  );
}

export default App;
