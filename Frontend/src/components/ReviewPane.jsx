/* eslint-disable react/prop-types */
import React from 'react';
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import CodeHistory from './CodeHistory';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { MdContentCopy, MdDone } from "react-icons/md";

const ReviewPane = ({
  review,
  isLoading,
  selectedLanguage,
  copyToClipboard,
  copyReviewFeedback,
  handleLoadCode,
}) => {
  return (
    <div className="review-pane">
      <CodeHistory onLoadCode={handleLoadCode} />
      <div className="review-toolbar">
        <h3 style={{'margin': 0}}>AI Review</h3>
        {review && (
          <button
            onClick={() => copyToClipboard(review, 'review')}
            className={`toolbar-button copy-button ${copyReviewFeedback === 'Copied!' ? 'copied' : ''}`}
            title="Copy review to clipboard"
            disabled={!review.trim()}
          >
            {copyReviewFeedback === 'Copied!' ? <MdDone /> : <MdContentCopy />}
            {copyReviewFeedback}
          </button>
        )}
      </div>
      {isLoading && !review && (
        <div className="loading-placeholder">
          <AiOutlineLoading3Quarters className="loading-icon-large" />
          <p>Fetching your code review for {selectedLanguage.label} code...</p>
          <p className="loading-subtext">This might take a few moments.</p>
        </div>
      )}
      {review && (
        <div className="markdown-display">
          <Markdown
            rehypePlugins={[rehypeHighlight]}
          >
            {review}
          </Markdown>
        </div>
      )}
      {!isLoading && !review && (
        <div className="empty-review-placeholder">
          <p>Your code review will appear here. <br/>Type or paste your code on the left, select the language, and click.</p>
        </div>
      )}
    </div>
  );
};

export default ReviewPane;
