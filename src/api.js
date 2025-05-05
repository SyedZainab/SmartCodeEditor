import axios from "axios";

export const executeCode = async (language, sourceCode) => {
  try {
    const response = await axios.post("http://localhost:5121/api/execute", {
      language,
      sourceCode,
    });
    return { run: response.data };
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to execute code");
  }
};