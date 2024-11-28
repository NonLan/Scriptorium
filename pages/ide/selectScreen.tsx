import React, { useState } from "react";
import Head from "next/head";
import { IoMdArrowDropdown } from "react-icons/io";
import { useCode, Language } from "@/components/codeContext";

export default function SelectScreen() {
  const { setLanguage } = useCode();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('sh'); // for local

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value as Language);
  };

  const startButton = () => {
    if(selectedLanguage){
      setLanguage(selectedLanguage)
    }
  }

  return (
    <>
      <Head>
        <title>Language Select</title>
      </Head>

      <div className="text-center p-24">
        <h1>Your Project Begins...</h1>
        <h1>HERE!</h1>
      </div>

      <div className="h-96 m-4 sm:m-10 bg-primeBlue rounded-2xl flex flex-col md:flex-row items-center justify-center">
        <div className="relative w-full sm:w-auto mb-4 sm:mb-0">
          <select onChange={changeLanguage} className="block appearance-none w-full sm:w-96 max-w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500">
            <option value="sh">Bash</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="go">Go</option>
            {/* <option value="hs">Haskell</option> */}
            <option value="java">Java</option>
            <option value="js">JavaScript</option>
            {/* <option value="jl">Julia</option> */}
            <option value="php">PHP</option>
            <option value="pl">Perl</option>
            <option value="py">Python</option>
            {/* <option value="r">R</option> */}
            <option value="rb">Ruby</option>
            <option value="scala">Scala</option>
            {/* <option value="swift">Swift</option> */}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <IoMdArrowDropdown className="w-8 h-8 text-gray-600" />
          </div>
        </div>

        <button
          className="px-10 mx-12 my-4 h-12 rounded hover:bg-opacity-80 font-spaceGrotesk font-extrabold text-4xl text-primeBlue select-none terminal"
          onClick={startButton}
        >
          BEGIN
        </button>
      </div>
      <div className="p-16"></div>
    </>
  );
}
