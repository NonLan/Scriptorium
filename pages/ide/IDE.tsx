import CodeSpace from "@/components/ideComponents/codeSpace";
import Terminal from "@/components/ideComponents/terminal";
import SelectScreen from "./selectScreen";
import { useCode } from "@/components/codeContext";
import { useEffect } from "react";

export default function IDE() {
  const { language, title, code, setCode, setLanguage } = useCode();
  useEffect(() =>{  
    // clear out code if there is no title
    if(title === "" && code !== ""){
    setCode("");
    setLanguage("");
  }
  }, [])

  return (
    <>
        {language ? (
          <>
            <CodeSpace /> <Terminal />
          </>
        ) : (
          <SelectScreen />
        )}
    </>
  );
}
