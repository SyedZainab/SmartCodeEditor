import { Button, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Analyzes code and generates a mock AI suggestion based on its content.
 * @param {string} code - The current code from the editor
 * @returns {Object} An object containing the suggested code, reason, and whether a suggestion was applied
 */
const generateMockSuggestion = (code) => {
  const trimmedCode = code.trim();
  if (!trimmedCode) {
    return { suggestion: code, reason: "No code provided.", applied: false };
  }

  // Check if a try-catch already exists to prevent nesting
  if (
    trimmedCode.includes("try {") ||
    trimmedCode.includes("// AI Suggestion: Add error handling")
  ) {
    return {
      suggestion: code,
      reason: "Try-catch already present; no further error handling added.",
      applied: false,
    };
  }

  if (trimmedCode.includes("function ")) {
    const suggestion = trimmedCode.replace(
      /function\s+(\w+)\s*\(([^)]*)\)\s*{([^}]*)}/,
      "const $1 = ($2) => {$3}"
    );
    return {
      suggestion,
      reason: "Converted function to arrow function for concise, modern JavaScript.",
      applied: true,
    };
  } else if (trimmedCode.includes("for (")) {
    const suggestion = trimmedCode.replace(
      /for\s*\(let\s+(\w+)\s*=\s*0;\s*\1\s*<\s*(\w+)\.length;\s*\1\+\+\)\s*{([^}]*)}/,
      "$2.forEach(($1) => {$3})"
    );
    return {
      suggestion,
      reason: "Replaced for loop with forEach for improved readability.",
      applied: true,
    };
  } else if (!trimmedCode.includes("//")) {
    const suggestion = `// Auto-generated comment: Main logic\n${trimmedCode}`;
    return {
      suggestion,
      reason: "Added a comment to improve code documentation.",
      applied: true,
    };
  } else {
    const suggestion = `// AI Suggestion: Add error handling\ntry {\n  ${trimmedCode}\n} catch (error) {\n  console.error(error);\n}`;
    return {
      suggestion,
      reason: "Added try-catch for robust error handling.",
      applied: true,
    };
  }
};

/**
 * Tracks an analytics event (mock implementation).
 * @param {string} event - The event name (e.g., "AI_Suggestion_Applied")
 * @param {Object} [data] - Additional data to track
 */
const trackEvent = (event, data = {}) => {
  console.log(`Analytics: ${event}`, data);
};

/**
 * Debounces a function to limit how often it can be called.
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce delay in milliseconds
 * @returns {Function} A debounced version of the function
 */
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      timeout = null;
      func(...args);
    }, wait);
  };
};

/**
 * A button that fetches a mock AI-powered code suggestion and applies it to the editor.
 * Enhances the coding experience with intelligent mock suggestions, robust error handling,
 * accessibility, debouncing, analytics, and user feedback. Supports undo via Ctrl+Z.
 * @param {Object} props - Component props
 * @param {Object} props.editorRef - Reference to the code editor instance (e.g., Monaco Editor)
 * @returns {JSX.Element} A button to fetch and apply AI suggestions
 */
const AISuggestionButton = ({ editorRef }) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionHistory, setSuggestionHistory] = useState([]);
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Debug editorRef availability
  useEffect(() => {
    if (editorRef.current) {
      console.log("AISuggestionButton: editorRef.current is available");
      setIsEditorReady(true);
    } else {
      console.log("AISuggestionButton: editorRef.current is null");
      setIsEditorReady(false);
    }
  }, [editorRef]);

  const fetchSuggestions = debounce(async () => {
    setIsLoading(true);
    try {
      if (!editorRef.current) {
        throw new Error("Editor is not available. Please ensure the editor is loaded.");
      }
      const currentCode = editorRef.current.getValue() || "";
      if (!currentCode.trim()) {
        toast({
          title: "No Code",
          description: "Please enter some code to get a suggestion.",
          status: "warning",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
        return;
      }
      const { suggestion, reason, applied } = generateMockSuggestion(currentCode);

      if (!applied) {
        toast({
          title: "No Changes Applied",
          description: reason,
          status: "info",
          duration: 6000,
          isClosable: true,
          position: "top-right",
        });
        return;
      }

      // Apply suggestion in a way that supports undo (e.g., for Monaco Editor)
      if (editorRef.current.executeEdits) {
        // Monaco Editor: Use executeEdits to support undo
        const range = editorRef.current.getModel().getFullModelRange();
        editorRef.current.executeEdits("ai-suggestion", [
          { range, text: suggestion },
        ]);
        // Ensure editor focus for immediate Ctrl+Z
        editorRef.current.focus();
      } else {
        // Fallback for other editors: Use setValue and manually handle undo via history
        editorRef.current.setValue(suggestion);
      }

      toast({
        title: "Suggestion Applied",
        description: `Reason: ${reason} Press Ctrl+Z to undo.`,
        status: "success",
        duration: 6000,
        isClosable: true,
        position: "top-right",
      });

      const suggestionEntry = {
        original: currentCode,
        suggestion,
        reason,
        timestamp: new Date().toISOString(),
      };
      setSuggestionHistory((prev) => [...prev, suggestionEntry].slice(-5));
      trackEvent("AI_Suggestion_Applied", {
        suggestionType: reason,
        codeLength: currentCode.length,
        historyCount: suggestionHistory.length + 1,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to apply AI suggestion. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      trackEvent("AI_Suggestion_Error", { error: error.message });
    } finally {
      setIsLoading(false);
    }
  }, 500);

  return (
    <Button
      colorScheme="blue"
      onClick={fetchSuggestions}
      isLoading={isLoading}
      isDisabled={isLoading}
      mt={2}
      ml={2}
      mb={2} 
      aria-label="Get AI-powered code suggestion"
      aria-busy={isLoading}
      title="Apply an AI-generated code suggestion"
      _hover={{ bg: "blue.600" }}
      data-testid="ai-suggestion-button"
    >
      Get AI Suggestion
    </Button>
  );
};

AISuggestionButton.propTypes = {
  editorRef: PropTypes.shape({
    current: PropTypes.any,
  }).isRequired,
};

export default AISuggestionButton;