// runs the code given and returns an error or results + console outputs
// accepts a stdin as another variable

import { exec } from "child_process";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method === "POST") {
    let { code, language, stdin } = req.body;

    // since called internally, shouldnt happen
    if (!code || !language) {
      return res.status(400).json({ error: "Missing params" });
    }

    const executable = path.join(process.cwd(), "process");

    let compileCommand = "";
    let dockerImg, execCommand;

    switch (language) {
      case "py":
        dockerImg = "python:alpine";
        execCommand = `python3 /app/process.py ${stdin}`;
        break;
      case "c":
        dockerImg = "gcc:latest";
        execCommand = `sh -c "gcc /app/process.c -o /app/process && /app/process ${stdin}"`;
        break;
      case "cpp":
        dockerImg = "gcc:latest";
        execCommand = `sh -c "g++ /app/process.cpp -o /app/process && /app/process ${stdin}"`;
        break;
      // 4GB image, no thank you
      // case "hs":
      //   compileCommand = `ghc -o ${executable} ${executable}.hs`;
      //   execCommand = `${executable}`;
      //   break;
      case "js":
        dockerImg = "node:alpine";
        execCommand = `node /app/process.js ${stdin}`;
        break;
      case "rb":
        dockerImg = "ruby:alpine";
        execCommand = `ruby /app/process.rb ${stdin}`;
        break;
      case "php":
        dockerImg = "php:alpine";
        execCommand = `php /app/process.php ${stdin}`;
        break;
      // ALSO 4GB??!?!?
      // case "swift":
      //   dockerImg = "swift:latest";
      //   execCommand = `swift /app/process.swift ${stdin}`;
      //   break;
      case "pl":
        dockerImg = "perl:slim";
        execCommand = `perl /app/process.pl ${stdin}`;
        break;
      case "sh":
        dockerImg = "bash:devel-alpine3.20";
        execCommand = `bash /app/process.sh ${stdin}`;
        break;
      // case "r":
      // Way too big too
      //   execCommand = `Rscript ${executable}.r`;
      //   break;
      case "go":
        dockerImg = "golang:alpine";
        execCommand = `go run /app/process.go ${stdin}`;
        break;
      case "scala":
        dockerImg = "bigtruedata/scala:2.12.4-alpine";
        execCommand = `scala /app/process.scala ${stdin}`;
        break;
      case "java":
        // // remove public if needed for simplicity
        if (code.includes("public class")) {
          code = code.replace(/public\s+class/, "class");
        }
        // // parse for the main class name (made by chatgpt)
        const className = code.match(/class\s+([A-Za-z0-9_]+)/);
        if (!className || className.length < 2) {
          return res.status(400).json({ error: "No class found" });
        }

        // compileCommand = `javac ${executable}.java`;
        // execCommand = `java -cp ${process.cwd()} ${className[1]}`;
        dockerImg = "openjdk:alpine";
        execCommand = `sh -c "javac process.java && java -cp /app ${className[1]} ${stdin}"`;
        break;

      default:
        return res.status(400).json({ error: "Language not supported" });
    }

    // write the code to executable
    let fullFileName = executable + "." + language;
    fs.writeFileSync(fullFileName, code);

    // // compile the code if needed
    // if (compileCommand) {
    //   exec(compileCommand, (error, stdout, stderr) => {
    //     if (error) {
    //       if (language === "java") {
    //         // parse for the main class name
    //         const className = code.match(/class\s+([A-Za-z0-9_]+)/);
    //         if (!className || className.length < 2) {
    //           return res.status(400).json({ error: "No class found" });
    //         }
    //         // Remove the compiled java file
    //         fs.unlink(`${className[1]}.class`, (err) => {
    //           if (err) {
    //             console.error(`Couldn't delete ${err}`);
    //           }
    //         });
    //       } else {
    //         // remove compile file
    //         fs.unlink(executable, (err) => {
    //           if (err) {
    //             console.error(`Couldn't delete ${err}`);
    //           }
    //         });
    //       }

    //       return res.status(400).json({ error: stderr });
    //     }
    //   });
    // }

    // small delay to make sure code doesnt get ahead of itself
    let pause = 1000;

    console.log(stdin);

    const dockerCommand = `docker run --rm -v ${executable}.${language}:/app/process.${language} -w /app ${dockerImg} ${execCommand}`;

    console.log(dockerCommand);

    setTimeout(() => {
      // run the executable
      const program = exec(
        dockerCommand,
        { timeout: 10000, input: stdin },
        (error, stdout, stderr) => {
          // clean up the files
          fs.unlink(fullFileName, (err) => {
            if (err) {
              console.error(`Couldn't delete ${err}`);
            }
          });
          // if (language === "java") {
          //   // parse for the main class name
          //   const className = code.match(/class\s+([A-Za-z0-9_]+)/);
          //   if (!className || className.length < 2) {
          //     return res.status(400).json({ error: "No class found" });
          //   }
          //   // Remove the compiled java file
          //   fs.unlink(`${className[1]}.class`, (err) => {
          //     if (err) {
          //       console.error(`Couldn't delete ${err}`);
          //     }
          //   });
          // }

          if (error) {
            if (error.code === 124) {
              // timeout, after 20 seconds
              return res
                .status(400)
                .json({ error: "Process timed out after 10 seconds" });
            } else {
              // return error in json
              return res.status(400).json({ error: stderr });
            }
          }

          // return result in json
          res.status(200).json({ message: stdout });
        }
      );

      // check for input
      // if (stdin) {
      //   // write to stdin
      //   console.log(stdin);
      //   program.stdin.write(stdin);
      //   program.stdin.end();
      // }
    }, pause);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
