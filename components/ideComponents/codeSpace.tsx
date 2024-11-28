import React, { useState, useEffect } from "react";
import { Space_Mono } from "next/font/google";
import codeColour from "./lineColour";
import { useCode } from "@/components/codeContext";

const spaceMono = Space_Mono({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function CodeSpace() {
  const { code, setCode, language } = useCode();
  const [highlightedCode, setHighlightedCode] = useState("");

  const parseText = (e: { target: { value: string } }) => {
    const value = e.target.value;
    setCode(value);
    setHighlightedCode(codeColour(language, value));
  };

  const handleTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const cursorPos = target.selectionStart ?? 0;
      const updatedCode =
        code.substring(0, cursorPos) + "    " + code.substring(cursorPos);
      setCode(updatedCode);
      setHighlightedCode(codeColour(language, updatedCode));
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = cursorPos + 4; // Adjust cursor position
      }, 0);
      return;
    }

    const openingBrac = ['(', '{', '[', '"'];
    const closeBrac = {
      '(': ')',
      '{': '}',
      '[': ']',
      '"': '"',
    };

    if (openingBrac.includes(e.key)) {
      e.preventDefault(); // Prevent the default insertion of the character
  
      const target = e.target as HTMLTextAreaElement;
      const cursorPos = target.selectionStart ?? 0; // Get the current cursor position
  
      const updatedCode =
        code.substring(0, cursorPos) + e.key + (closeBrac[e.key as keyof typeof closeBrac]) + code.substring(cursorPos);
  
      setCode(updatedCode);
      setHighlightedCode(codeColour(language, updatedCode));
  
      // Move the cursor between the brackets
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = cursorPos + 1;
      }, 0);
  
      return;
    }
  }

  useEffect(() => {
    // fetch starter code
    const fetchStarterCode = async () => {
      try {
        const response = await fetch(
          `/api/ide/starterCode?language=${language}`
        );
        if (response.ok) {
          const data = await response.json();
          setCode(data.starterCode);
          setHighlightedCode(codeColour(language, data.starterCode));
        } else {
          console.error("Failed to fetch starter code");
        }
      } catch (error) {
        console.error("Error fetching starter code:", error);
      }
    };

    if(code === ""){
      fetchStarterCode();
    }else{
      setHighlightedCode(codeColour(language, code));
    }
  }, []);

  const getLineNumbers = () => {
    const stringLines = code || "";
    const lines = stringLines.split("\n");
    return lines.map((_, index) => index + 1).join("\n");
  };

  // sync scrolling for line number
  const syncScroll = (e: { currentTarget: {scrollTop: any} }) => {
    const scrollTop = e.currentTarget.scrollTop;
    const lineNumber = document.getElementById("lineNumbers");
    const visualText = document.getElementById("visualText");
    if (lineNumber) {
      lineNumber.scrollTop = scrollTop; // Sync line numbers scroll
    }

    if (visualText) {
      visualText.scrollTop = scrollTop; // Sync visual text scroll
    }
  }

  return (
    <div className={`${spaceMono.className} text-sm sm:text-xl`}>
      <div className="flex w-full h-screen font-mono relative">
        <div id="lineNumbers" className="w-14 flex-shrink-0 text-left p-2 bg-black bg-opacity-30 overflow-hidden">
          <pre className="text-opacity-20">{getLineNumbers()}</pre>
        </div>
        <div className="flex-1 pt-2 pl-5 sm:pl-10 relative ">
          {/* Highlighted code */}
          <pre
            spellCheck={false} // remove squigglies
            id="visualText"
            className="absolute pt-2 pl-5 sm:pl-10 inset-0 z-10 pointer-events-none overflow-hidden"
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          ></pre>

          {/* Textarea */}
          <textarea
            spellCheck={false} // remove squigglies
            value={code}
            onChange={parseText}
            onKeyDown={handleTab}
            onScroll={syncScroll}
            // onKeyDown={parseText} // to finds tab input
            className="w-full h-full border-none resize-none outline-none bg-transparent text-transparent z-20 overflow-auto"
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          ></textarea>
        </div>
      </div>
    </div>
  );
}
