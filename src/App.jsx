import React, { useState, useEffect } from 'react';

// Main App Component
export default function App() {
  // State for the raw Base64 input
  const [base64Input, setBase64Input] = useState('');
  // State for the formatted JSON output
  const [formattedJson, setFormattedJson] = useState('');
  // State for any error messages
  const [error, setError] = useState('');
  // State for copy button feedback
  const [copySuccess, setCopySuccess] = useState('');

  /**
   * Handles the decoding and formatting process.
   */
  const handleDecodeAndFormat = () => {
    // Clear previous results and errors
    setError('');
    setFormattedJson('');

    // This check is now handled by the useEffect
    // if (!base64Input.trim()) {
    //   setError('Input is empty. Please paste your Base64 data.');
    //   return;
    // }

    try {
      // Step 1: Decode the Base64 string
      // atob() decodes a string of data which has been encoded using base-64 encoding.
      const decodedString = atob(base64Input);

      // Step 2: Parse the decoded string as JSON
      // JSON.parse() parses a JSON string, constructing the JavaScript
      // value or object described by the string.
      const jsonObject = JSON.parse(decodedString);

      // Step 3: Stringify the JSON object with formatting
      // JSON.stringify() with null (replacer) and 2 (space)
      // creates a human-readable (beautified) string.
      const prettyJson = JSON.stringify(jsonObject, null, 2);

      // Set the successful result
      setFormattedJson(prettyJson);
    } catch (e) {
      // Handle errors that can occur during atob() or JSON.parse()
      let errorMessage = 'An unknown error occurred.';
      if (e instanceof DOMException && e.name === 'InvalidCharacterError') {
        errorMessage = 'Invalid Base64 string. Please check your input.';
      } else if (e instanceof SyntaxError) {
        errorMessage = 'Decoded data is not valid JSON. Please check your input.';
      } else if (e instanceof Error) {
        errorMessage = e.message;
      }
      setError(errorMessage);
    }
  };

  /**
   * Auto-decode effect.
   * Triggers whenever the base64Input state changes.
   */
  useEffect(() => {
    if (base64Input.trim() === '') {
      // Clear output and error if input is empty
      setError('');
      setFormattedJson('');
      return;
    }
    
    // Call the decode function
    handleDecodeAndFormat();
  }, [base64Input]); // Dependency: re-run when base64Input changes

  /**
   * Clears all inputs, outputs, and errors.
   */
  const handleClear = () => {
    setBase64Input('');
    setFormattedJson('');
    setError('');
  };

  /**
   * Copies the formatted JSON output to the clipboard.
   * Uses a fallback method (document.execCommand) for iFrame compatibility.
   */
  const handleCopy = () => {
    if (!formattedJson || error) return; // Don't copy if no valid output

    const textArea = document.createElement('textarea');
    textArea.value = formattedJson;
    
    // Make the textarea invisible and out of the layout
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000); // Reset after 2s
      } else {
        setCopySuccess('Failed');
        setTimeout(() => setCopySuccess(''), 2000);
      }
    } catch (err) {
      setCopySuccess('Failed');
      setTimeout(() => setCopySuccess(''), 2000);
    }

    document.body.removeChild(textArea);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white font-sans p-4">
      <div className="w-full max-w-6xl p-6 md:p-8 bg-gray-800 rounded-2xl shadow-2xl">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-400 mb-6">
          Base64 to Formatted JSON
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Paste your Base64-encoded JSON data below to decode and beautify it.
        </p>

        {/* Input/Output Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          
          {/* Input Section */}
          <div className="flex flex-col">
            <label htmlFor="base64Input" className="text-lg font-semibold mb-2 text-gray-300">
              Base64 Input
            </label>
            <textarea
              id="base64Input"
              value={base64Input}
              onChange={(e) => setBase64Input(e.target.value)}
              placeholder="Paste your Base64 string here...
(e.g., eyJuYW1lIjogIkpvaG4gRG9lIiwgImFnZSI6IDMwfQ==)"
              className="flex-grow p-4 bg-gray-900 border-2 border-gray-700 rounded-lg shadow-inner resize-none h-64 md:h-96 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-200"
            />
          </div>

          {/* Output Section */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="jsonOutput" className="text-lg font-semibold text-gray-300">
                Formatted JSON Output
              </label>
              <button
                onClick={handleCopy}
                disabled={!formattedJson || !!error}
                className="flex items-center px-3 py-1 bg-gray-700 text-gray-300 rounded-md text-sm hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
              >
                {/* Inline SVG Clipboard Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {copySuccess || 'Copy'}
              </button>
            </div>
            <pre
              id="jsonOutput"
              className="flex-grow p-4 bg-gray-900 border-2 border-gray-700 rounded-lg shadow-inner overflow-auto h-64 md:h-96"
            >
              {/* Show error message if it exists */}
              {error && (
                <code className="text-red-400 whitespace-pre-wrap">
                  {error}
                </code>
              )}
              {/* Show formatted JSON if it exists and there's no error */}
              {formattedJson && !error && (
                <code className="text-green-300 whitespace-pre-wrap">
                  {formattedJson}
                </code>
              )}
              {/* Show placeholder if no output and no error */}
              {!formattedJson && !error && (
                <code className="text-gray-500">
                  Your formatted JSON will appear here...
                </code>
              )}
            </pre>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center gap-4 mt-8">
          {/* "Decode & Format" button is removed for auto-decode feature */}
          <button
            onClick={handleClear}
            className="w-full sm:w-auto px-8 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200"
          >
            Clear
          </button>
        </div>
        
      </div>
    </div>
  );
}

