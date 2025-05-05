export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  c: "6.3.0",        // MinGW GCC version
  cpp: "6.3.0",      // MinGW G++ version
  python: "3.10.0",
  java: "15.0.2",
  csharp: "6.12.0",
  php: "8.2.3",
  go: "1.22.0"
};

export const CODE_SNIPPETS = {
  javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
   c: `\n#include <stdio.h>\n\nint main() {\n\tprintf("Hello from C!\\n");\n\treturn 0;\n}\n`,
  cpp: `\n#include <iostream>\nusing namespace std;\n\nint main() {\n\tcout << "Hello from C++!" << endl;\n\treturn 0;\n}\n`,
  go: `\npackage main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello from Go!")\n}\n`,
  python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
  java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
  csharp:
    'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
  php: "<?php\n\n$name = 'Alex';\necho $name;\n",
};
