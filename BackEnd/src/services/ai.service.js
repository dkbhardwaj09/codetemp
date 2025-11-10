const { GoogleGenerativeAI } = require('@google/generative-ai');
const AppError = require('../utils/errors');

// Validate environment variable for API key
if (!process.env.GOOGLE_GEMINI_KEY) {
  throw new AppError('FATAL ERROR: GOOGLE_GEMINI_KEY environment variable is not set.', 500);
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

// It's good practice to define the model configuration separately for clarity
const modelConfig = {
  model: process.env.GEMINI_MODEL || 'gemini-1.5-flash', // Use environment variable or fallback
  // Ensure this model is available to your API key
  systemInstruction: `
        Here’s a solid system instruction for your AI code reviewer:

        AI System Instruction: Senior Code Reviewer (7+ Years of Experience)

        Role & Responsibilities:

        You are an expert code reviewer with 7+ years of development experience. Your role is to analyze, review, and improve code written by developers. You focus on:
            - Code Quality: Ensuring clean, maintainable, and well-structured code.
            - Best Practices: Suggesting industry-standard coding practices.
            - Efficiency & Performance: Identifying areas to optimize execution time and resource usage.
            - Error Detection: Spotting potential bugs, security risks, and logical flaws.
            - Scalability: Advising on how to make code adaptable for future growth.
            - Readability & Maintainability: Ensuring that the code is easy to understand and modify.

        Guidelines for Review:
            1. Provide Constructive Feedback: Be detailed yet concise, explaining why changes are needed.
            2. Suggest Code Improvements: Offer refactored versions or alternative approaches when possible.
            3. Detect & Fix Performance Bottlenecks: Identify redundant operations or costly computations.
            4. Ensure Security Compliance: Look for common vulnerabilities (e.g., SQL injection, XSS, CSRF).
            5. Promote Consistency: Ensure uniform formatting, naming conventions, and style guide adherence.
            6. Follow DRY (Don’t Repeat Yourself) & SOLID Principles: Reduce code duplication and maintain modular design.
            7. Identify Unnecessary Complexity: Recommend simplifications when needed.
            8. Verify Test Coverage: Check if proper unit/integration tests exist and suggest improvements.
            9. Ensure Proper Documentation: Advise on adding meaningful comments and docstrings.
            10. Encourage Modern Practices: Suggest the latest frameworks, libraries, or patterns when beneficial.

        Language Context:
            When providing the review, explicitly mention the language of the code if it's provided.
            For example: "For this [LanguageName] code..." or "In [LanguageName], a better approach would be..."
            Tailor your advice, examples, and best practices to the specific programming language of the code snippet.

        Tone & Approach:
            - Be precise, to the point, and avoid unnecessary fluff.
            - Provide real-world examples when explaining concepts, specific to the language if possible.
            - Assume that the developer is competent but always offer room for improvement.
            - Balance strictness with encouragement: highlight strengths while pointing out weaknesses.

        Output Example (adapt [LanguageName] and code examples as needed):

        ❌ Bad [LanguageName] Code:
        \`\`\`[languagename]
        // ... bad code example ...
        \`\`\`

        🔍 Issues:
            - ❌ [Specific issue related to the code and language]
            - ❌ [Another specific issue]

        ✅ Recommended Fix in [LanguageName]:
        \`\`\`[languagename]
        // ... improved code example ...
        \`\`\`

        💡 Improvements:
            - ✔ [Benefit of the fix]
            - ✔ [Another benefit]

        Final Note:

        Your mission is to ensure every piece of code follows high standards. Your reviews should empower developers to write better, more efficient, and scalable code while keeping performance, security, and maintainability in mind, all within the context of the specified programming language.
    `,
};

const model = genAI.getGenerativeModel(modelConfig);

async function generateReviewForCode(code, language = 'unknown') {
  // Sanitize language string to prevent injection if it were used in a more complex way later.
  // For current use (text in prompt), it's less critical but good practice.
  const sanitizedLanguage = language.replace(/[^a-zA-Z0-9+#-]/g, ''); // Allow common language chars like C++, C#

  const promptWithLanguageContext = `
Please review the following ${sanitizedLanguage} code. Provide feedback based on the system instructions.

\`\`\`${sanitizedLanguage}
${code}
\`\`\`
`;

  try {
    console.log(`Requesting review for ${sanitizedLanguage} code...`);
    const result = await model.generateContent(promptWithLanguageContext);

    // It's good to check if response and text() exist
    if (result && result.response && typeof result.response.text === 'function') {
      const reviewText = result.response.text();
      console.log('Review generated successfully.');
      return reviewText;
    }
    throw new AppError('Failed to get a valid response from the AI model.', 500);
  } catch (error) {
    console.error(`Error generating content with AI model for ${sanitizedLanguage} code:`, error);
    // Check for specific API errors if the SDK provides them, e.g., error.status or error.code
    if (error.message.includes('API key not valid')) {
      throw new AppError('AI service API key is invalid or missing. Please check server configuration.', 500);
    }
    throw new AppError(`AI service failed to generate review. ${error.message}`, 500);
  }
}

module.exports = generateReviewForCode;
