import { render, screen } from "@testing-library/react";
import CodeEditor from "../src/components/CodeEditor";
import { ChakraProvider } from "@chakra-ui/react";

describe("CodeEditor", () => {
  it("renders the language selector and run code button", () => {
    render(
      <ChakraProvider>
        <CodeEditor />
      </ChakraProvider>
    );

    expect(screen.getByText("Language:")).toBeInTheDocument();
    expect(screen.getByText("Run Code")).toBeInTheDocument();
    expect(screen.getByText("Get AI Suggestion")).toBeInTheDocument();
  });
});