/* eslint-disable react/prop-types */
import React from 'react';
import Editor from 'react-simple-code-editor';
import prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-markup-templating.js';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { IoLanguageSharp } from "react-icons/io5";
import { MdContentCopy, MdDone, MdSave } from "react-icons/md";

const CodeEditor = ({
  code,
  setCode,
  selectedLanguage,
  handleLanguageChange,
  supportedLanguages,
  copyToClipboard,
  copyCodeFeedback,
  clearCode,
  reviewCode,
  isLoading,
  saveCode,
}) => {
  return (
    <div className="editor-pane">
      <div className="editor-toolbar">
        <div className="language-selector-wrapper" title="Select programming language">
          <IoLanguageSharp className="toolbar-icon language-icon" />
          <select
            value={selectedLanguage.value}
            onChange={handleLanguageChange}
            className="language-select"
            aria-label="Select programming language"
          >
            {supportedLanguages.map(lang => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        <div className="toolbar-buttons-group">
          <button
            onClick={() => copyToClipboard(code, 'code')}
            className={`toolbar-button copy-button ${copyCodeFeedback === 'Copied!' ? 'copied' : ''}`}
            title="Copy code to clipboard"
            disabled={!code.trim()}
          >
            {copyCodeFeedback === 'Copied!' ? <MdDone /> : <MdContentCopy />}
            {copyCodeFeedback}
          </button>
          <button
            onClick={clearCode}
            className="toolbar-button clear-button"
            title="Clear code editor and reset to sample"
          >
            Clear Code
          </button>
        </div>
      </div>
      <div className="code-editor-wrapper">
        <Editor
          value={code}
          onValueChange={newCode => setCode(newCode)}
          highlight={codeContent => {
            const prismLang = prism.languages[selectedLanguage.value];
            if (prismLang) {
              return prism.highlight(codeContent, prismLang, selectedLanguage.value);
            }
            return codeContent;
          }}
          padding={12}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 15,
            color: "#d4d4d4",
            minHeight: "350px",
          }}
          textareaClassName="editor-textarea"
          preClassName="editor-pre"
        />
      </div>
      <div className="action-buttons">
        <button
          onClick={reviewCode}
          className="review-button"
          disabled={isLoading || !code.trim()}
          title={!code.trim() ? "Please enter some code to review" : "Get AI code review"}
        >
          {isLoading ? (
            <>
              <AiOutlineLoading3Quarters className="loading-icon" /> Reviewing...
            </>
          ) : (
            'Review Code'
          )}
        </button>
        <button
          onClick={saveCode}
          className="toolbar-button save-button"
          disabled={!code.trim()}
          title="Save code to your account"
        >
          <MdSave />
          Save Code
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
