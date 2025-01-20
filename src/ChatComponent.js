import React, { useState } from "react";
import axios from "axios";
import { modifyPrompt } from "./compare";

const ChatComponent = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [response, setResponse] = useState({}); // Initialize as a JSON object
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const prompt = modifyPrompt(userPrompt);
      const res = await axios.post("http://localhost:8020/chat", { prompt });
      console.log("API raw response:", res.data.response);

      // Get the raw response data
      let rawResponse = res.data.response;

      // If the raw response is a string, clean it up by removing newline characters
      if (typeof rawResponse === 'string') {
        // Remove newline characters but maintain spaces and other formatting
        rawResponse = rawResponse.replace(/\n/g, ''); // Removes newline characters only
        console.log("Cleaned response (newlines removed):", rawResponse);

        // Try to parse it as JSON
        try {
          rawResponse = JSON.parse(rawResponse); // Parse cleaned string into JSON object
        } catch (error) {
          console.error("Error parsing JSON:", error);
          rawResponse = { error: "Invalid response format." };
        }
      }

      let formattedResponse;

      // Handle different types of responses
      if (rawResponse === null) {
        // If response is null, wrap it in an object
        formattedResponse = { data: null };
      } else if (typeof rawResponse === "object" && !Array.isArray(rawResponse)) {
        // If response is a valid object (and not an array)
        formattedResponse = rawResponse;
      } else if (Array.isArray(rawResponse)) {
        // If response is an array, wrap it in an object with a "data" key
        formattedResponse = { data: rawResponse };
      } else if (typeof rawResponse === "string" || typeof rawResponse === "number" || typeof rawResponse === "boolean") {
        // If response is a primitive value (string, number, boolean), wrap it in an object
        formattedResponse = { data: rawResponse };
      } else {
        // For unexpected cases (undefined, or unknown type), wrap it as a string
        formattedResponse = { data: String(rawResponse) };
      }

      // Set the formatted response
      setResponse(formattedResponse);

    } catch (error) {
      console.error("Error fetching response:", error.message || error);
      setResponse({ error: "Error fetching response. Please try again." });
    } finally {
      setLoading(false);
      setUserPrompt("");
    }
  };

  // Function to clean up values by removing quotes from string values
  const removeQuotes = (value) => {
    if (typeof value === "string" && value.startsWith('"') && value.endsWith('"')) {
      // Remove quotes from the start and end of the string
      return value.slice(1, -1);
    }
    return value;
  };

  const DynamicEnumerator = ({ response }) => (
    <div>
      <h2>Response</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Property</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Operator</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(response).map(([key, value], index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                <strong>{key}</strong>
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {JSON.stringify(removeQuotes(value), null, 2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={{ maxWidth: "80%", margin: "0 auto" }}>
      <h1>Request</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="10"
          cols="80"
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="Type your message here..."
          required
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Generate Response"}
        </button>
      </form>
      {Object.keys(response).length > 0 && (
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        >
          <DynamicEnumerator response={response} />
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
