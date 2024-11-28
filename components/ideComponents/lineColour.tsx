// checks the entire text area and returns the text with all the needed words coloured

import languages from "./languages";
import { Language } from "@/components/codeContext";

export default function codeColour(language: Language, code: string) {

  if (language === '') {
    return '';
  }

  const keywords = languages[language].colour;

  if (!code) {
    return "";
  }

  // Regular expressions for detecting comments gotten from online
  const singleLineCommentRegex = /\/\/.*$/gm; // Matches '// comment'
  const multiLineCommentRegex = /\/\*[\s\S]*?\*\//gm; // Matches '/* comment */'
  const pythonCommentRegex = /#.*$/gm;
  const doubleQuoteStringRegex = /"([^"\\]*(\\.[^"\\]*)*)"/g;
  const numberRegex = /\b\d+(\.\d+)?\b/g; // Matches integers and decimals

  // for perserving the c and cpp include brackets
  const angleBrackets = (code: string) => {
    return code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };

  code = angleBrackets(code);

  const words = code.split(/(\s+|\b)/);

  // split into an array of individual words
  let colouredCode = words
    .map((word: string) => {
      if (keywords.includes(word)) {
        return `<span class='text-primeBlue font-bold'>${word}</span>`;
      }

      return word;
    })
    .join("");

  colouredCode = colouredCode.replace(
    numberRegex,
    (match: string) => `<span class='text-purple-400'>${match}</span>`
  );

  colouredCode = colouredCode.replace(
    doubleQuoteStringRegex,
    (match: string) => `<span class='text-primeRed'>${match}</span>`
  );

  let finalCode;

  // apply color to comments
  if (language === "py" || language === "sh" || language === "rb") {
    finalCode = colouredCode.replace(
      pythonCommentRegex,
      (match: string) => `<span class='text-green-600'>${match}</span>`
    );
  } else {
    finalCode = colouredCode
      .replace(
        singleLineCommentRegex,
        (match: string) => `<span class='text-green-600'>${match}</span>`
      )
      .replace(
        multiLineCommentRegex,
        (match: string) => `<span class='text-green-600'>${match}</span>`
      );
  }

  return finalCode;
}
