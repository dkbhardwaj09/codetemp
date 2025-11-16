/* eslint-disable no-unused-vars */
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCodeReview } from './hooks/useCodeReview.jsx';
import CodeEditor from './CodeEditor';
import ReviewPane from './ReviewPane';
import '../App.css';

function MainApp() {
    const { currentUser } = useAuth();
    const {
        selectedLanguage,
        code,
        review,
        isLoading,
        copyCodeFeedback,
        copyReviewFeedback,
        supportedLanguages,
        setCode,
        handleLoadCode,
        saveCode,
        reviewCode,
        clearCode,
        handleLanguageChange,
        copyToClipboard,
    } = useCodeReview(currentUser);

    return (
        <main className="main-content">
            <CodeEditor
                code={code}
                setCode={setCode}
                selectedLanguage={selectedLanguage}
                handleLanguageChange={handleLanguageChange}
                supportedLanguages={supportedLanguages}
                copyToClipboard={copyToClipboard}
                copyCodeFeedback={copyCodeFeedback}
                clearCode={clearCode}
                reviewCode={reviewCode}
                isLoading={isLoading}
                saveCode={saveCode}
            />
            <ReviewPane
                review={review}
                isLoading={isLoading}
                selectedLanguage={selectedLanguage}
                copyToClipboard={copyToClipboard}
                copyReviewFeedback={copyReviewFeedback}
                handleLoadCode={handleLoadCode}
            />
        </main>
    );
}

export default MainApp;
