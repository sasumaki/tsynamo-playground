/* eslint-disable @typescript-eslint/no-explicit-any */
import debounce from "lodash.debounce";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import { Header } from "./components/Header";
import MySnackbar from "./components/Snackbar";
import { CodeEditor } from "./tabs/CodeEditor";
import { Results } from "./tabs/Results";
import { TypeEditor } from "./tabs/TypeEditor";
import { useSnackbar } from "./util/hooks";


const DEBOUNCE_TIME = 200;

function App() {
  const typeEditorRef = useRef<any>(null);
  const codeEditorRef = useRef<any>(null);
  const resultsRef = useRef<any>(null);
  const { notify, snackbarMessage } = useSnackbar()

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
      notify("URL copied to clipboard")
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
        <Header />
        <Editors>
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
        </Editors>
        <MySnackbar message={snackbarMessage} />
      </AppContainer>
    </>
  );
}

export default App;

const AppContainer = styled.div`
  width: 100vw;
  max-width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const Editors = styled.div`
  width: 100vw;
  max-width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: row;
  flex: 1;
overflow: hidden;
`;