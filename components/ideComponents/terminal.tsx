import React, { useState, useEffect } from "react";
import { useCode } from "@/components/codeContext";
import { Language } from "@/components/codeContext";

type User = {
  id: number;
};

export default function Terminal() {
  const [height, setHeight] = useState(150);
  const [resizing, setResizing] = useState(false);
  const { id, setId, authorId, setAuthorId, code, language, stdin, setStdin, description, forkFrom, setDescription, tags, setTags, title, setTitle, setForkFrom } = useCode();
  const [output, setOutput] = useState("Your output will appear here!");
  const [user, setUser] = useState(-1);

  const [saveConfirmation, setSaveConfirmation] = useState(false);
  const [errorDialog, setErrorDialog] = useState(false);
  const [errorDialogText, setErrorDialogText] = useState("");
  const [editDialog, setEditDialog] = useState(false);

  // for draggable terminal window
  const handleMouseDown = () => {
    setResizing(true);
  };

  // follow the mouse
  const handleMouseMove = (e: { clientY: number; }) => {
    if (resizing) {
      const newHeight = window.innerHeight - e.clientY;
      setHeight(Math.max(80, Math.min(newHeight, window.innerHeight * 0.8))); // Clamp height
    }
  };

  // release the bar
  const handleMouseUp = () => {
    setResizing(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.ok) {
          // there is a user
          const data: User = await res.json();

          setUser(data.id)
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizing]);

  // for running code
  const runCode = async () => {
    try {
      const requestBody = { code: code, language: language, stdin: stdin };

      const response = await fetch(`/api/ide/codeRunner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === "") {
          setOutput("No output!");
        } else {
          setOutput(data.message);
        }
      } else {
        const data = await response.json();
        setOutput(data.error);
      }
    } catch (error) {
      console.error("POST Request failed:", (error as Error).message);
    }
  };

  const editPopUp = () => {
    // open the edit popup
    setEditDialog(true);
  }

  const saveCode = async () => {
    // close the edit dialog
    setEditDialog(false);
    // send the local input as stdin
    try {
      if(user === -1){
        // not allowed to save code
        setErrorDialogText("Visitors don't have permission to save, consider signing up!");
        setErrorDialog(true);
        return;
      }

      if(id !== -1 && authorId === user && forkFrom === -1){
        const requestBody : { id: number; authorid: number; title?: string; description?: string; tags?: string[]; code?: string; stdin?: string; } = 
                            { id: id, authorid: user, title: title, description: description, tags: tags, code: code, stdin: stdin};
  
        const response = await fetch(
          `/api/template/authenticated`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          });

        const responseData = await response.json();

        if (response.ok) {
          setSaveConfirmation(true);
        } else {
          setErrorDialog(true);
          setErrorDialogText(responseData.error);
          console.error("Failed to update code");
        }
  
        return;
      }
      // save as new code
  
      const requestBody : { authorid: number; title: string; description: string; tags: string[]; code: string; language: Language; stdin: string; forkedFromid?: number } = 
                          { authorid: user, title: title, description: description, tags: tags, code: code, language: language, stdin: stdin };
  
      // get title, description, and tags from user

      console.log(forkFrom);
  
      if (forkFrom !== -1){
        requestBody.forkedFromid = forkFrom;
      }
  
      const response = await fetch(
        `/api/template/authenticated`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (response.ok) {
        setId(responseData.id)
        setForkFrom(-1);
        setAuthorId(user);
        setSaveConfirmation(true);
      } else {
        setErrorDialog(true);
        setErrorDialogText(responseData.error);
        console.error("Failed to save code");
      }
    } catch (error) {
      console.error("Error saving/editing code:", error);
    }
  
  }

  const parseTags = (inputTags: string) => {
    // parse the comma seperated tags to tags string
    setTags(inputTags.split(',').map(tag => tag.trim()));
  }

  const changeLocalInput = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setStdin(e.target.value);
  }

  return (
    <div
      className="fixed h-20 z-30 bottom-0 left-0 w-full terminal"
      style={{
        height: `${height}px`,
        transition: resizing ? "none" : "0.2s",
      }}
    >

      {errorDialog ? (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-primeBlue p-4">
          <h2 className="text-lg sm:text-xl md:text-2xl text-center">{errorDialogText}</h2>
          <button className="bg-primeRed m-4 px-8 py-2 sm:px-8 sm:py-3 rounded-md font-bold text-sm sm:text-base" 
                  onClick={() => {setErrorDialog(false)}}>Ok!</button>
        </div>
      ) : (<></>)}

      {saveConfirmation ? (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-primeBlue p-4">
          <h2 className="text-lg sm:text-xl md:text-2xl text-center">Code Saved!</h2>
          <button className="bg-primeRed m-4 px-8 py-2 sm:px-8 sm:py-3 rounded-md font-bold text-sm sm:text-base" 
                  onClick={() => {setSaveConfirmation(false)}}>Ok!</button>
        </div>
      ) : (<></>)}

      {editDialog ? (
      <div className="fixed inset-0 bg-opacity-80 flex flex-col items-center justify-center bg-primeBlue p-4">
        <h2 className="my-4 text-2xl">Information</h2>

        <div className="mb-4 w-full max-w-lg">
          <label className="block text-2xl font-medium" >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-xl"
          />
        </div>

        <div className="mb-4 w-full max-w-lg h-52">
          <label className="block text-2xl font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-xl h-40 resize-none p-2"
          />
        </div>

        <div className="mb-4 w-full max-w-lg">
          <label className="block text-2xl font-medium" >
            Tags
          </label>
          <input
            id="title"
            type="text"
            spellCheck={false}
            value={tags}
            onChange={(e) => parseTags(e.target.value)}
            className="mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-xl"
          />
        </div>

        <button className="bg-primeRed m-4 px-8 py-2 rounded-md font-bold"
                onClick={() => {setEditDialog(false); saveCode();}}><h4>SUBMIT</h4></button>
      </div>
      ):(<></>)}


      <div
        className="h-2 cursor-row-resize bg-primeBlue bg-opacity-80 "
        onMouseDown={handleMouseDown}
      ></div>

      <div className="bg-primeBlue font-spaceGrotesk flex flex-wrap items-center justify-between p-4 md:p-6">
        
      {(user !== -1) ? (
        <button
          className="px-4 py-2 my-2 mx-2 sm:px-6 sm:py-3 rounded hover:bg-opacity-80 font-spaceGrotesk font-extrabold text-lg sm:text-2xl md:text-3xl text-primeBlue select-none terminal"
          onClick={editPopUp}
        >
          SAVE
        </button>) : (<></>)}

        <div className="flex flex-wrap items-center w-full sm:w-auto space-y-2 sm:space-y-0">
          <label className="m-4 text-lg sm:text-xl md:text-2xl">Input:</label>
          <input className="flex-shrink py-2 px-4 text-base sm:text-lg md:text-xl w-36 md:w-80 terminal border-none rounded-md" type="text" onChange={changeLocalInput} value={stdin}></input>
          <button
            className="px-4 py-2 my-2 mx-2 sm:px-6 sm:py-3 rounded hover:bg-opacity-80 font-spaceGrotesk font-extrabold text-lg sm:text-2xl md:text-3xl text-primeBlue select-none terminal"
            onClick={runCode}
          >
            RUN
          </button>
        </div>
        
      </div>
      <div
        className="px-4 sm:px-6 py-6 overflow-auto text-sm sm:text-base md:text-lg"
        style={{
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          maxHeight: "550px",
          overflowY: "auto",
        }}
      >
        {output}
      </div>
    </div>
  );
}
