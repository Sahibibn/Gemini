import React, { useRef, useState } from "react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const SYSTEM_PROMPT = `
You are Gemini AI, an expert programming and technology assistant.

Your goal is to provide accurate, practical, beginner-friendly, and professional answers.

========================
GENERAL RESPONSE RULES
========================

1. Always understand the user's question before answering.
2. Answer in clear and simple English.
3. Avoid unnecessary technical jargon.
4. Be concise by default.
5. Provide detailed explanations when necessary.
6. Never invent APIs, libraries, methods, functions, or technical information.
7. If you are uncertain, clearly say so instead of guessing.
8. Use modern and recommended practices.
9. If multiple solutions exist, recommend the best approach first.
10. Keep responses professional, friendly, and easy to understand.

========================
PROGRAMMING QUESTIONS
========================

When answering programming questions:

- First explain the problem.
- Explain the solution step by step.
- Provide complete working code when code is requested.
- Clearly mention where the code should be placed.
- Explain important parts of the code.
- Mention common mistakes when useful.

When fixing code:

1. Identify the problem.
2. Explain why it happens.
3. Provide the corrected code.
4. Explain the changes.

========================
CODE RULES
========================

- Always use Markdown code blocks.
- Specify the programming language.
- Prefer complete working examples.
- Use meaningful variable and function names.
- Follow modern best practices.

Example:

\`\`\`javascript
const message = "Hello World";
console.log(message);
\`\`\`

========================
REACT / JAVASCRIPT
========================

For React and JavaScript:

- Prefer functional components and hooks.
- Follow modern React practices.
- Explain state, props, hooks, events, and API calls when relevant.
- Avoid deprecated approaches.
- For errors, identify the exact cause before suggesting a fix.

========================
WEB DEVELOPMENT
========================

For HTML, CSS, Tailwind CSS, React, Node.js, Express, and related technologies:

- Explain file and folder locations when relevant.
- Provide installation commands when required.
- Explain configuration changes clearly.
- Mention environment variables when required.
- Never expose secret API keys publicly.

========================
BACKEND / API
========================

For backend questions:

- Explain request and response flow.
- Explain routes, controllers, middleware, models, and services when applicable.
- Include HTTP methods and status codes when useful.
- Follow REST API best practices.

========================
LEARNING MODE
========================

If the user is learning a concept:

1. Give a simple definition.
2. Explain the concept using an easy example.
3. Show a practical example.
4. Explain the code step by step.
5. Mention common mistakes.
6. Give a short practice task when appropriate.

========================
ERROR DEBUGGING
========================

When the user provides an error, use this structure:

## Problem

Explain what the error means.

## Cause

Explain why it is happening.

## Solution

Give the exact steps to fix it.

## Corrected Code

Provide complete corrected code when necessary.

## Why This Works

Briefly explain the fix.

========================
RESPONSE FORMAT
========================

Use Markdown formatting to make responses easy to read.

Use:

- ## headings
- ### subheadings
- **bold** for important terms
- bullet points for lists
- numbered lists for steps
- Markdown code blocks for code
- short paragraphs instead of large blocks of text

For programming answers, use this structure when appropriate:

## Short Answer

A direct answer in 1–3 sentences.

## Explanation

Explain the concept clearly.

## Step-by-Step

1. Step one
2. Step two
3. Step three

## Example

Provide a practical example.

## Code

Provide complete working code.

## Important Notes

Mention important warnings or common mistakes.

Do not force every section when it is not necessary.

========================
TONE
========================

Be:

- Professional
- Friendly
- Clear
- Helpful
- Direct
- Beginner-friendly

Your goal is not only to give an answer but also to help the user understand the solution.
`;

const App = () => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);

  const aiRef = useRef(
    new GoogleGenAI({
      apiKey: import.meta.env.VITE_API_KEY,
    })
  );

  const getData = async () => {
    const userInput = inputRef.current?.value.trim();

    if (!userInput) return;

    setLoading(true);
    setResponse("");

    try {
      const result = await aiRef.current.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: `
${SYSTEM_PROMPT}

========================
USER QUESTION
========================

${userInput}
`,
      });

      setResponse(result.text || "No response received from Gemini.");

      // Clear input after successful request
      inputRef.current.value = "";
    } catch (error) {
      console.error("Gemini API Error:", error);

      setResponse(
        `## Something went wrong

Unable to get a response from Gemini.

### Possible reasons

- API key may be missing or invalid.
- The selected Gemini model may not be available.
- There may be a network connection problem.
- Your API request may have exceeded its limits.

Please check your API configuration and try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      getData();
    }
  };

  const clearResponse = () => {
    setResponse("");

    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6">

      {/* Main Container */}
      <div className="w-full max-w-5xl bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">

        {/* ================= HEADER ================= */}
        <div className="bg-slate-800 px-6 py-5 border-b border-slate-700">

          <div className="flex items-center justify-between gap-4">

            {/* Logo + Title */}
            <div className="flex items-center gap-4">

              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">
                  AI
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Gemini AI
                </h1>

                <p className="text-sm text-slate-400 mt-1">
                  Your intelligent programming assistant
                </p>
              </div>

            </div>

            {/* Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-green-500/10 border border-green-500/20">

              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>

              <span className="text-xs text-green-400 font-medium">
                AI Online
              </span>

            </div>

          </div>

        </div>

        {/* ================= INPUT SECTION ================= */}
        <div className="p-5 sm:p-6 border-b border-slate-700">

          <div className="flex flex-col sm:flex-row gap-3">

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask anything about programming..."
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="
                flex-1
                bg-slate-950
                text-white
                placeholder-slate-500
                px-5
                py-3.5
                rounded-xl
                outline-none
                border
                border-slate-700
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500/20
                transition
                disabled:opacity-50
              "
            />

            {/* Ask Button */}
            <button
              onClick={getData}
              disabled={loading}
              className="
                bg-blue-600
                hover:bg-blue-700
                active:scale-95
                disabled:bg-blue-800
                disabled:cursor-not-allowed
                text-white
                font-semibold
                px-7
                py-3.5
                rounded-xl
                transition-all
                duration-200
                min-w-27.5
              "
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">

                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>

                  Thinking...
                </span>
              ) : (
                "Ask AI"
              )}
            </button>

          </div>

          {/* Input Help */}
          <div className="flex items-center justify-between mt-3">

            <p className="text-xs text-slate-500">
              Press <span className="text-slate-400">Enter</span> to send
            </p>

            <p className="hidden sm:block text-xs text-slate-500">
              React • JavaScript • Python • APIs • Web Development
            </p>

          </div>

        </div>

        {/* ================= RESPONSE SECTION ================= */}

        {response ? (

          <div className="p-5 sm:p-6">

            {/* Response Card */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">

              {/* Response Header */}
              <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400 font-bold text-sm">
                      AI
                    </span>
                  </div>

                  <div>
                    <h2 className="text-blue-400 font-semibold text-lg">
                      Gemini Response
                    </h2>

                    <p className="text-xs text-slate-500">
                      AI-generated programming assistance
                    </p>
                  </div>

                </div>

                {/* Clear Button */}
                <button
                  onClick={clearResponse}
                  className="
                    text-xs
                    text-slate-400
                    hover:text-white
                    px-3
                    py-2
                    rounded-lg
                    hover:bg-slate-700
                    transition
                  "
                >
                  Clear
                </button>

              </div>

              {/* Response Content */}
              <div className="p-5 sm:p-7 text-slate-200 leading-7">

                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{

                    /* H1 */
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold text-white mt-6 mb-4">
                        {children}
                      </h1>
                    ),

                    /* H2 */
                    h2: ({ children }) => (
                      <h2 className="text-xl font-bold text-blue-400 mt-7 mb-3 pb-2 border-b border-slate-700">
                        {children}
                      </h2>
                    ),

                    /* H3 */
                    h3: ({ children }) => (
                      <h3 className="text-lg font-semibold text-white mt-5 mb-3">
                        {children}
                      </h3>
                    ),

                    /* Paragraph */
                    p: ({ children }) => (
                      <p className="mb-4 text-slate-300">
                        {children}
                      </p>
                    ),

                    /* Unordered List */
                    ul: ({ children }) => (
                      <ul className="list-disc ml-6 mb-5 space-y-2 text-slate-300">
                        {children}
                      </ul>
                    ),

                    /* Ordered List */
                    ol: ({ children }) => (
                      <ol className="list-decimal ml-6 mb-5 space-y-2 text-slate-300">
                        {children}
                      </ol>
                    ),

                    /* List Item */
                    li: ({ children }) => (
                      <li className="pl-1">
                        {children}
                      </li>
                    ),

                    /* Bold */
                    strong: ({ children }) => (
                      <strong className="font-semibold text-white">
                        {children}
                      </strong>
                    ),

                    /* Italic */
                    em: ({ children }) => (
                      <em className="text-slate-300 italic">
                        {children}
                      </em>
                    ),

                    /* Inline / Block Code */
                    code: ({ className, children, ...props }) => {

                      const isInline = !className;

                      if (isInline) {
                        return (
                          <code
                            className="
                              bg-slate-950
                              text-blue-300
                              px-1.5
                              py-0.5
                              rounded
                              text-sm
                              border
                              border-slate-700
                            "
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      }

                      return (
                        <code
                          className="
                            block
                            bg-slate-950
                            text-green-300
                            p-4
                            rounded-xl
                            overflow-x-auto
                            text-sm
                            leading-6
                          "
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },

                    /* Code Block */
                    pre: ({ children }) => (
                      <pre
                        className="
                          bg-slate-950
                          border
                          border-slate-700
                          rounded-xl
                          overflow-x-auto
                          mb-6
                          mt-4
                        "
                      >
                        {children}
                      </pre>
                    ),

                    /* Blockquote */
                    blockquote: ({ children }) => (
                      <blockquote
                        className="
                          border-l-4
                          border-blue-500
                          pl-4
                          my-5
                          text-slate-400
                          italic
                          bg-slate-900/50
                          py-2
                          rounded-r-lg
                        "
                      >
                        {children}
                      </blockquote>
                    ),

                    /* Horizontal Rule */
                    hr: () => (
                      <hr className="border-slate-700 my-6" />
                    ),

                    /* Links */
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        {children}
                      </a>
                    ),

                    /* Tables */
                    table: ({ children }) => (
                      <div className="overflow-x-auto mb-6">
                        <table className="w-full border-collapse border border-slate-700 text-sm">
                          {children}
                        </table>
                      </div>
                    ),

                    thead: ({ children }) => (
                      <thead className="bg-slate-950">
                        {children}
                      </thead>
                    ),

                    th: ({ children }) => (
                      <th className="border border-slate-700 px-4 py-3 text-left text-white font-semibold">
                        {children}
                      </th>
                    ),

                    td: ({ children }) => (
                      <td className="border border-slate-700 px-4 py-3 text-slate-300">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {response}
                </ReactMarkdown>

              </div>

              {/* Response Footer */}
              <div className="px-5 py-3 border-t border-slate-700 bg-slate-900/50">

                <p className="text-xs text-slate-500 text-center">
                  Gemini AI • Always verify important information before using it.
                </p>

              </div>

            </div>

          </div>

        ) : (

          /* ================= EMPTY STATE ================= */

          <div className="px-6 py-16 text-center">

            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">

              <span className="text-blue-400 text-2xl font-bold">
                AI
              </span>

            </div>

            <h2 className="text-xl font-semibold text-white mb-2">
              How can I help you?
            </h2>

            <p className="text-slate-500 max-w-md mx-auto text-sm leading-6">
              Ask me about programming, web development,
              React, JavaScript, Python, APIs, debugging,
              or computer science.
            </p>

            {/* Suggestions */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">

              <button
                onClick={() => {
                  inputRef.current.value =
                    "Explain React useEffect with a simple example";
                  inputRef.current.focus();
                }}
                className="
                  text-xs
                  text-slate-400
                  border
                  border-slate-700
                  hover:border-blue-500
                  hover:text-blue-400
                  px-3
                  py-2
                  rounded-lg
                  transition
                "
              >
                React useEffect
              </button>

              <button
                onClick={() => {
                  inputRef.current.value =
                    "Explain REST API in simple terms";
                  inputRef.current.focus();
                }}
                className="
                  text-xs
                  text-slate-400
                  border
                  border-slate-700
                  hover:border-blue-500
                  hover:text-blue-400
                  px-3
                  py-2
                  rounded-lg
                  transition
                "
              >
                REST API
              </button>

              <button
                onClick={() => {
                  inputRef.current.value =
                    "Explain JavaScript promises with examples";
                  inputRef.current.focus();
                }}
                className="
                  text-xs
                  text-slate-400
                  border
                  border-slate-700
                  hover:border-blue-500
                  hover:text-blue-400
                  px-3
                  py-2
                  rounded-lg
                  transition
                "
              >
                JavaScript Promises
              </button>

              <button
                onClick={() => {
                  inputRef.current.value =
                    "How does Node.js work?";
                  inputRef.current.focus();
                }}
                className="
                  text-xs
                  text-slate-400
                  border
                  border-slate-700
                  hover:border-blue-500
                  hover:text-blue-400
                  px-3
                  py-2
                  rounded-lg
                  transition
                "
              >
                Node.js
              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
};

export default App;