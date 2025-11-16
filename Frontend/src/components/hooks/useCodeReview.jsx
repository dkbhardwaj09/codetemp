import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const supportedLanguages = [
    { value: 'javascript', label: 'JavaScript', sample: `function greet(name) {\n  console.log(\`Hello, \${name}!\`);\n}\ngreet('World');` },
    { value: 'jsx', label: 'JSX', sample: `function MyComponent() {\n  return <div>Hello JSX!</div>;\n}\n` },
    { value: 'python', label: 'Python', sample: `def greet(name):\n  print(f"Hello, {name}!")\n\ngreet('World')` },
    { value: 'java', label: 'Java', sample: `public class HelloWorld {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}` },
    { value: 'c', label: 'C', sample: `#include <stdio.h>\n\nint main() {\n  printf("Hello, C!\\n");\n  return 0;\n}` },
    { value: 'cpp', label: 'C++', sample: `#include <iostream>\n\nint main() {\n  std::cout << "Hello, C++!" << std::endl;\n  return 0;\n}` },
    { value: 'csharp', label: 'C#', sample: `using System;\n\npublic class Hello {\n  public static void Main(string[] args) {\n    Console.WriteLine("Hello, C#!");\n  }\n}` },
    { value: 'go', label: 'Go', sample: `package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello, Go!")\n}` },
    { value: 'ruby', label: 'Ruby', sample: `def greet(name)\n  puts "Hello, #{name}!"\nend\n\ngreet('World')` },
    { value: 'php', label: 'PHP', sample: `<?php\nfunction greet($name) {\n  echo "Hello, " . $name . "!\\n";\n}\ngreet('World');\n?>` },
    { value: 'swift', label: 'Swift', sample: `func greet(name: String) {\n  print("Hello, \\(name)!")\n}\ngreet(name: "World")` },
    { value: 'typescript', label: 'TypeScript', sample: `function greet(name: string): void {\n  console.log(\`Hello, \${name}!\`);\n}\ngreet('World');` },
];

export const useCodeReview = (currentUser) => {
    const [selectedLanguage, setSelectedLanguage] = useState(supportedLanguages[0]);
    const [code, setCode] = useState(supportedLanguages[0].sample);
    const [review, setReview] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copyCodeFeedback, setCopyCodeFeedback] = useState('Copy Code');
    const [copyReviewFeedback, setCopyReviewFeedback] = useState('Copy Review');

    const handleLoadCode = (newCode, langValue) => {
        const foundLang = supportedLanguages.find(l => l.value === langValue) || supportedLanguages[0];
        setCode(newCode);
        setSelectedLanguage(foundLang);
        setReview('');
        toast.dismiss();
    };

    const saveCode = async () => {
        if (!code.trim()) {
            toast.error("Cannot save empty code.");
            return;
        }
        if (!currentUser) {
            toast.error("You must be logged in to save code.");
            return;
        }

        const promise = addDoc(collection(db, "codeSnippets"), {
            userId: currentUser.uid,
            code: code,
            language: selectedLanguage.value,
            createdAt: serverTimestamp()
        });

        toast.promise(promise, {
            loading: 'Saving your code...',
            success: <b>Code saved to your history!</b>,
            error: <b>Could not save your code.</b>,
        }, {
            success: { duration: 3000 },
            error: { duration: 4000 },
        });
    };

    const reviewCode = async () => {
        if (!code.trim()) {
            toast.error("Code cannot be empty. Please enter some code to review.");
            return;
        }
        setIsLoading(true);
        setReview('');

        const backendURL = "/ai";

        try {
            const response = await axios.post(`${backendURL}/get-review`, {
                code,
                language: selectedLanguage.value,
            });
            setReview(response.data);
        } catch (err) {
            console.error("Error fetching review:", err);
            const errorMessage = err.response?.data?.message || 'Failed to fetch review. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const clearCode = () => {
        setCode(selectedLanguage.sample || `// ${selectedLanguage.label} code`);
        setReview('');
        toast.dismiss();
    };

    const handleLanguageChange = (event) => {
        const langValue = event.target.value;
        const foundLang = supportedLanguages.find(l => l.value === langValue) || supportedLanguages[0];
        setSelectedLanguage(foundLang);
        setCode(foundLang.sample || `// Start typing your ${foundLang.label} code here`);
        setReview('');
    };

    const copyToClipboard = (text, type) => {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            const feedback = 'Copied!';
            if (type === 'code') setCopyCodeFeedback(feedback);
            else setCopyReviewFeedback(feedback);
            toast.success('Copied to clipboard!', { duration: 2000 });
            setTimeout(() => {
                if (type === 'code') setCopyCodeFeedback('Copy Code');
                else setCopyReviewFeedback('Copy Review');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            toast.error('Failed to copy to clipboard.', { duration: 3000 });
        });
    };

    return {
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
    };
};
