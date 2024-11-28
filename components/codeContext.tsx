import React, { createContext, useContext, useState, ReactNode } from "react";

// for sharing the code for terminal output
const CodeContext = createContext<{ id: number; setId: React.Dispatch<React.SetStateAction<number>>;
                                    authorId: number; setAuthorId: React.Dispatch<React.SetStateAction<number>>;
                                    code: string; setCode: React.Dispatch<React.SetStateAction<string>>; 
                                    language: Language;  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
                                    stdin: string; setStdin: React.Dispatch<React.SetStateAction<string>>;
                                    forkFrom: number; setForkFrom: React.Dispatch<React.SetStateAction<number>>;
                                    title: string; setTitle: React.Dispatch<React.SetStateAction<string>>;
                                    description: string; setDescription: React.Dispatch<React.SetStateAction<string>>;
                                    tags: string[]; setTags: React.Dispatch<React.SetStateAction<string[]>>;} | null>(null);

export type Language = '' | 'py' | 'c' | 'cpp' | 'js' | 'java' | 'go' | 'rb' | 
                        'php' | 'pl' | 'sh' | 'scala';

type CodeProviderProps = {
  children: ReactNode;
};

export function CodeProvider({ children } : CodeProviderProps  ) {
  const [id, setId] = useState(-1);
  const [authorId, setAuthorId] = useState(-1);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<Language>("");
  const [stdin, setStdin] = useState("");
  const [forkFrom, setForkFrom] = useState(-1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  return (
    <CodeContext.Provider value={{ id, setId, authorId, setAuthorId, code, setCode, language, setLanguage, stdin, setStdin, 
                                  forkFrom, setForkFrom, title, setTitle, description, setDescription,
                                  tags, setTags}}>
      {children}
    </CodeContext.Provider>
  );
}

export function useCode() {
  const context = useContext(CodeContext);
  if(!context){
    throw new Error("useCode must be used within a CodeProvider");
  }
  return context;
}
