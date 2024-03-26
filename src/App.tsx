/* eslint-disable @typescript-eslint/no-explicit-any */
import debounce from "lodash.debounce";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { useEffect, useRef } from "react";
import { AppContainer } from "./styles/styledComponents";
import { CodeEditor } from "./tabs/CodeEditor";
import { Results } from "./tabs/Results";
import { TypeEditor } from "./tabs/TypeEditor";

const DEBOUNCE_TIME = 200;

function App() {
  const typeEditorRef = useRef<any>(null);
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
    onTypeEditorChange();
  };
  const onCodeEditorChange = useRef(
    debounce(() => {
      if (resultsRef.current) {
        resultsRef.current.execute(codeEditorRef.current?.getValue());
      }
    }, DEBOUNCE_TIME)
  ).current;

  const handleCodeEditorChange = () => {
    onCodeEditorChange();
  };

  const handleSave = async (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "s") {
      event.preventDefault();

      const appState = {
        editors: {
          type: typeEditorRef.current.getValue(),
          code: codeEditorRef.current.getValue(),
        },
      };
      const encodedState = compressToEncodedURIComponent(
        JSON.stringify(appState)
      );

      window.history.replaceState(
        null,
        "",
        window.location.origin +
          window.location.pathname +
          window.location.search
      );
      window.location.hash = encodedState;

      await navigator.clipboard.writeText(window.location.href);
      event.stopPropagation();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleSave);
    return () => {
      window.removeEventListener("keydown", handleSave);
    };
  }, []);

  let stateFromUrl = {
    editors: {
      code: null,
      type: null,
    },
  };
  try {
    const currentLocationHash = window.location.hash;
    const stateFromUrlJson = decompressFromEncodedURIComponent(
      currentLocationHash?.slice(1)
    );
    stateFromUrl = JSON.parse(stateFromUrlJson);
  } catch (e) {
    console.error("Invalid state in url. Doing nothing.", e);
  }
  return (
    <>
      <AppContainer>
        <TypeEditor
          ref={typeEditorRef}
          onChange={handleTypeEditorOnChange}
          valueFromUrl={stateFromUrl?.editors?.type}
        />
        <CodeEditor
          ref={codeEditorRef}
          onChange={handleCodeEditorChange}
          resultsRef={resultsRef}
          valueFromUrl={stateFromUrl?.editors?.code}
        />
        <Results ref={resultsRef} />
      </AppContainer>
    </>
  );
}

export default App;
