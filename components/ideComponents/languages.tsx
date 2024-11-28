// returns the colouring and starter code based on language specified
// the list of keywords for colour were generated from ChatGPT
// returns the colouring and starter code based on language specified
// the list of keywords for colour were generated from ChatGPT
export default {
  py: {
    colour: [
      "False", "None", "True", "and", "as", "assert", "async", "await", "break", "class", "continue", "def", 
      "del", "elif", "else", "except", "finally", "for", "from", "global", "if", "import", "in", "is", 
      "lambda", "nonlocal", "not", "or", "pass", "raise", "return", "try", "while", "with", "yield",
    ],
    starter:
      'def main():\n    # !! Write your code here !!\n\n\nif __name__ == "__main__":\n    main()',
  },
  c: {
    colour: [
      "auto", "break", "case", "char", "const", "continue", "default", "do", "double", "else", "enum", 
      "extern", "float", "for", "goto", "if", "inline", "int", "long", "register", "restrict", "return", 
      "short", "signed", "sizeof", "static", "struct", "switch", "typedef", "union", "unsigned", "void", 
      "volatile", "while",
    ],
    starter:
      "#include <stdio.h>\n\nint main() {\n    // !! Write your code here !!\n\n    return 0;\n}",
  },
  cpp: {
    colour: [
      "asm", "auto", "bitand", "bitor", "bool", "break", "case", "catch", "char", "char16_t", "char32_t", "class", 
      "compl", "const", "const_cast", "continue", "decltype", "default", "delete", "do", "double", "dynamic_cast", 
      "else", "enum", "explicit", "export", "extern", "false", "float", "for", "friend", "goto", "if", "inline", 
      "int", "long", "mutable", "namespace", "new", "noexcept", "not", "not_eq", "nullptr", "operator", "or", 
      "or_eq", "private", "protected", "public", "register", "reinterpret_cast", "return", "short", "signed", 
      "sizeof", "static", "static_assert", "static_cast", "struct", "switch", "synchronized", "template", "this", 
      "thread_local", "throw", "true", "try", "typedef", "typeid", "typename", "union", "unsigned", "using", 
      "virtual", "void", "volatile", "wchar_t", "while", "xor", "xor_eq",
    ],
    starter:
      "#include <iostream>\n\nint main() {\n    // !! Write your code here !!\n\n    return 0;\n}",
  },
  js: {
    colour: [
      "await", "break", "case", "catch", "class", "const", "continue", "debugger", "default", "delete", "do", 
      "else", "export", "extends", "finally", "for", "function", "if", "import", "in", "instanceof", "let", "new", 
      "return", "super", "switch", "this", "throw", "try", "typeof", "var", "void", "while", "with", "yield",
    ],
    starter:
      "function main() {\n    // !! Write your code here !!\n}\n\n// Entry point of the script\nmain();",
  },
  java: {
    colour: [
      "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char", "class", "const", "continue", 
      "default", "do", "double", "else", "enum", "extends", "final", "finally", "float", "for", "goto", "if", 
      "implements", "import", "instanceof", "int", "interface", "long", "native", "new", "null", "package", 
      "private", "protected", "public", "return", "short", "static", "strictfp", "super", "switch", "synchronized", 
      "this", "throw", "throws", "transient", "try", "void", "volatile", "while",
    ],
    starter:
      "public class Main {\n    public static void main(String[] args) {\n        // !! Write your code here !!\n    }\n}",
  },
  go: {
    colour: [
      "break", "case", "chan", "const", "continue", "default", "defer", "else", "fallthrough", "for", "func", 
      "go", "goto", "if", "import", "interface", "map", "package", "range", "return", "select", "struct", "switch", 
      "type", "var",
    ],
    starter:
      "package main\n\nimport \"fmt\"\n\nfunc main() {\n    // !! Write your code here !!\n  }",
  },
  rb: {
    colour: [
      "begin", "break", "case", "class", "def", "defined?", "do", "else", "elsif", "end", "ensure", "false", 
      "for", "if", "in", "module", "next", "nil", "not", "or", "redo", "rescue", "retry", "return", "self", 
      "super", "then", "true", "undef", "unless", "until", "when", "while", "yield",
    ],
    starter:
      "def main\n    # !! Write your code here !!\nend\n\n# Entry point\nmain",
  },
  php: {
    colour: [
      "abstract", "and", "array", "as", "break", "callable", "case", "catch", "class", "clone", "const", "continue", 
      "declare", "default", "die", "do", "echo", "else", "elseif", "empty", "enddeclare", "endfor", "endforeach", 
      "endif", "endswitch", "eval", "exit", "extends", "final", "finally", "for", "foreach", "function", "global", 
      "goto", "if", "implements", "include", "include_once", "instanceof", "interface", "isset", "list", "namespace", 
      "new", "or", "print", "private", "protected", "public", "require", "require_once", "return", "static", 
      "switch", "throw", "trait", "try", "unset", "use", "var", "while", "xor",
    ],
    starter:
      "<?php\n\nfunction main() {\n    // !! Write your code here !!\n}\n\n// Entry point\nmain();",
  },
  swift: {
    colour: [
      "associativity", "break", "case", "class", "continue", "defer", "default", "do", "else", "enum", "extension", 
      "false", "for", "func", "guard", "if", "import", "in", "init", "infix", "let", "mutating", "nil", "nonmutating", 
      "open", "operator", "private", "protocol", "public", "return", "self", "static", "struct", "subscript", 
      "super", "switch", "throw", "try", "true", "var", "where", "while", "yield",
    ],
    starter:
      "import Foundation\n\nfunc main() {\n    // !! Write your code here !!\n}\n\n// Entry point\nmain()",
  },
  pl: {
    colour: [
      "my", "if", "else", "elsif", "unless", "foreach", "sub", "return", "do", "for", "unless", "while", "next", 
      "last", "package", "use", "qw", "print", "chomp", "split", "join", "map", "grep", "sort", "keys", "values",
    ],
    starter:
      "#!/usr/bin/perl\n\nsub main {\n    # !! Write your code here !!\n}\n\n# Entry point\nmain();",
  },
  sh: {
    colour: [
      "alias", "break", "case", "cd", "command", "continue", "do", "done", "elif", "else", "esac", "exit", "export", 
      "false", "fi", "for", "function", "if", "in", "let", "local", "popd", "pushd", "return", "set", "shift", 
      "source", "test", "then", "time", "trap", "true", "typeset", "ulimit", "unset", "until", "wait", "while",
    ],
    starter:
      "#!/bin/bash\n\n# !! Write your code here !!\n",
  },
  scala: {
    colour: [
      "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char", "class", "const", "continue", 
      "default", "do", "double", "else", "extends", "final", "finally", "for", "forSome", "if", "implicit", 
      "import", "lazy", "match", "native", "new", "null", "object", "override", "package", "private", "protected", 
      "return", "sealed", "super", "this", "throw", "trait", "try", "type", "val", "var", "while", "with", "yield"
    ],
    starter: 
      "object Main {\n  def main(args: Array[String]): Unit = {\n    // !! Write your code here !!\n  }\n}",
  },
};
