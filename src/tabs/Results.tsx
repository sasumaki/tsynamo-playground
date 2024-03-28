/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import styled from "styled-components";
import { transpile, ScriptTarget, ModuleKind } from "typescript";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs2015 as style } from "react-syntax-highlighter/dist/esm/styles/hljs";

// some hacks to execute the querybuilder copied from https://github.com/wirekang/kysely-playground/blob/main/src/lib/executer/executer.ts
function makeModule(js: string) {
  js = replaceImports(js);
  js = js + `\n\nawait new Promise(r=>setTimeout(r,0))`;

  js = js + `\n\nexport const timestamp = ${Date.now()};\n`;

  js = encodeURIComponent(js);
  return `data:text/javascript;charset=utf-8,${js}`;
}

function replaceImports(js: string): string {
  console.debug(js);
  const importMapping: Record<string, string> = {
    tsynamo:
      "https://cdn.jsdelivr.net/gh/sasumaki/minified-tsynamo/dist/main/index.mjs",
  };
  js = js.replace(
    /^(\s*import .+ from) (.+);/gm,
    (match: string, p1: string, p2: string) => {
      p2 = p2.trim();
      const quote = p2[0];
      if (quote !== p2[p2.length - 1]) {
        throw Error(`quote mismatch: ${quote} !== ${p2[p2.length - 1]}`);
      }
      p2 = p2.substring(1, p2.length - 1);

      if (importMapping[p2]) {
        return `${p1} ${quote}${importMapping[p2]}${quote};`;
      }
      return match;
    }
  );
  console.debug("static import replaced:\n", js);

  js = js.replace(/await import\("(\w+)"\)/g, (match: string, p1: string) => {
    if (importMapping[p1]) {
      return `await import("${importMapping[p1]}")`;
    }
    return match;
  });

  console.debug("dynamic import replaced 1:\n", js);
  js = js.replace(/await import\('(\w+)'\)/g, (match: string, p1: string) => {
    if (importMapping[p1]) {
      return `await import('${importMapping[p1]}')`;
    }
    return match;
  });
  console.debug("dynamic import replaced 2:\n", js);
  return js;
}

type ResultsProps = {
  onChange?: () => void;
};
type TouchHandle = {
  execute: (value: string) => void;
};

const defaultValue = "Call tsynamo.execute()";

export const Results = forwardRef<TouchHandle, ResultsProps>(
  (_, forwardedRef) => {
    const resultsRef = useRef(null);
    const compiledRef = useRef<string[]>([defaultValue]);
    const [, setState] = useState([defaultValue]);
    const execute = async (ts: string) => {
      compiledRef.current = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cb: EventListener = (event: any) => {
        compiledRef.current = [
          ...compiledRef.current,
          JSON.stringify(event.detail.clientCommand, undefined, 2),
        ];
        setState(() => compiledRef.current);
      };
      window.addEventListener("playground", cb);
      try {
        const transpiled = transpile(ts, {
          strict: false,
          skipLibCheck: true,
          noImplicitAny: false,
          target: ScriptTarget.ES2020,
          module: ModuleKind.ES2020,
        });
        const module = makeModule(transpiled);
        await import(/* @vite-ignore */ module);
      } catch (e) {
        compiledRef.current = [defaultValue]
      } finally {
        window.removeEventListener("playground", cb);
      }
    };

    useImperativeHandle(forwardedRef, () => ({
      mounted: () => resultsRef.current,
      execute: execute,
    }));

    return (
      <ResultsContainer ref={resultsRef}>
        <StyledSyntaxHighlighter language={"json"} style={style} wrapLines wrapLongLines >
          {compiledRef.current.length === 0 ? defaultValue : compiledRef.current.join("\n\n")}
        </StyledSyntaxHighlighter>
      </ResultsContainer>
    );
  }
);

const StyledSyntaxHighlighter = styled(SyntaxHighlighter)`
&::-webkit-scrollbar {
  display: none;
};

/* Hide scrollbar for IE and Edge */
-ms-overflow-style: none; /* IE and Edge */

/* Hide scrollbar for Firefox */
scrollbar-width: none; /* Firefox */
`
const ResultsContainer = styled.div`
  flex-grow: 1;
  width: 100%;
  color: white;
  font-family: Menlo, Monaco, "Courier New", monospace;
  font-weight: normal;
  font-size: 12px;
  font-feature-settings: "liga" 0, "calt" 0;
  font-variation-settings: normal;
  line-height: 18px;
  letter-spacing: 0px;
  width: 33%;
  max-width: 33%;
  height: 100vh;
  background-color: #1e1e1e;
  padding: 0px 26px;

`;
