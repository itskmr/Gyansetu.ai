import React from 'react';

/**
 * MessageFormatter component for rendering formatted educational content
 * Parses markdown-style formatting and renders proper headings, bullet points, etc.
 */
const MessageFormatter = ({ content }) => {
  // Content should never be null/undefined, but handle it just in case
  if (!content) return null;
  
  // Split the content by lines
  const lines = content.split('\n');
  
  // Process each line to apply formatting
  const formattedContent = lines.map((line, index) => {
    // Heading 1
    if (line.startsWith('# ')) {
      return (
        <h1 
          key={index} 
          className="text-xl font-bold mt-4 mb-2 text-violet-800"
        >
          {line.substring(2)}
        </h1>
      );
    }
    // Heading 2
    else if (line.startsWith('## ')) {
      return (
        <h2 
          key={index} 
          className="text-lg font-bold mt-3 mb-2 text-violet-700"
        >
          {line.substring(3)}
        </h2>
      );
    }
    // Heading 3
    else if (line.startsWith('### ')) {
      return (
        <h3 
          key={index} 
          className="text-md font-bold mt-2 mb-1 text-violet-600"
        >
          {line.substring(4)}
        </h3>
      );
    }
    // Bullet points
    else if (line.trimStart().startsWith('* ')) {
      return (
        <li 
          key={index} 
          className="ml-6 my-1 list-disc text-gray-800"
        >
          {line.trimStart().substring(2)}
        </li>
      );
    }
    // Numbered list 
    else if (/^\d+\.\s/.test(line.trimStart())) {
      const textContent = line.trimStart().replace(/^\d+\.\s/, '');
      return (
        <li 
          key={index}
          className="ml-6 my-1 list-decimal text-gray-800"
        >
          {textContent}
        </li>
      );
    }
    // Empty line
    else if (line.trim() === '') {
      return <div key={index} className="h-2"></div>;
    }
    // Regular text
    else {
      // Process emphasis and strong formatting
      const processedLine = processInlineFormatting(line);
      
      return (
        <p 
          key={index} 
          className="mb-2 text-gray-800"
        >
          {processedLine}
        </p>
      );
    }
  });
  
  return <div className="message-content">{formattedContent}</div>;
};

/**
 * Process inline formatting like bold, italic, code, etc.
 * @param {string} text - Text to process
 * @returns {Array} - Array of React elements and strings
 */
const processInlineFormatting = (text) => {
  // Split text by formatting markers
  const parts = [];
  let currentText = '';
  let inBold = false;
  let inItalic = false;
  let inCode = false;
  
  // Simple state machine to process formatting
  for (let i = 0; i < text.length; i++) {
    // Look for bold formatting with **
    if (i < text.length - 1 && text[i] === '*' && text[i + 1] === '*') {
      if (!inBold) {
        // Start bold formatting
        if (currentText) parts.push(currentText);
        currentText = '';
        inBold = true;
        i++; // Skip the second *
      } else {
        // End bold formatting
        parts.push(<strong key={parts.length}>{currentText}</strong>);
        currentText = '';
        inBold = false;
        i++; // Skip the second *
      }
      continue;
    }
    
    // Look for italic formatting with single *
    if (text[i] === '*' && !inBold && !inCode) {
      if (!inItalic) {
        // Start italic formatting
        if (currentText) parts.push(currentText);
        currentText = '';
        inItalic = true;
      } else {
        // End italic formatting
        parts.push(<em key={parts.length}>{currentText}</em>);
        currentText = '';
        inItalic = false;
      }
      continue;
    }
    
    // Look for inline code with `
    if (text[i] === '`') {
      if (!inCode) {
        // Start code formatting
        if (currentText) parts.push(currentText);
        currentText = '';
        inCode = true;
      } else {
        // End code formatting
        parts.push(
          <code 
            key={parts.length} 
            className="bg-gray-100 text-violet-700 px-1 py-0.5 rounded font-mono text-sm"
          >
            {currentText}
          </code>
        );
        currentText = '';
        inCode = false;
      }
      continue;
    }
    
    // Accumulate current character
    currentText += text[i];
  }
  
  // Add any remaining text
  if (currentText) {
    if (inBold) {
      parts.push(<strong key={parts.length}>{currentText}</strong>);
    } else if (inItalic) {
      parts.push(<em key={parts.length}>{currentText}</em>);
    } else if (inCode) {
      parts.push(
        <code 
          key={parts.length} 
          className="bg-gray-100 text-violet-700 px-1 py-0.5 rounded font-mono text-sm"
        >
          {currentText}
        </code>
      );
    } else {
      parts.push(currentText);
    }
  }
  
  return parts;
};

export default MessageFormatter;