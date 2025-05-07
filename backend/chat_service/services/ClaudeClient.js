const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

/**
 * ClaudeClient class for Anthropic Claude integration
 * Handles image generation for educational content
 */
class ClaudeClient {
  constructor() {
    this.initializeClaudeClient();
  }

  /**
   * Initialize Anthropic Claude client
   */
  initializeClaudeClient() {
    console.log('Initializing Claude client...');
    
    // Log configuration (without secrets)
    console.log(`API Key prefix: ${process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.substring(0, 4) + '...' : 'not set'}`);
    
    // Validate API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn('ANTHROPIC_API_KEY is not set. Image generation will use placeholders.');
    }
    
    // Initialize axios instance for Claude API
    this.client = axios.create({
      baseURL: 'https://api.anthropic.com',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': process.env.ANTHROPIC_API_KEY
      }
    });
  }
  
  /**
   * Generate an educational diagram using Claude
   * @param {string} class_or_course_name - Context about the educational topic
   * @param {string} query - The user's question
   * @param {string} context - Additional context or formatted response
   * @returns {Object} - The generated SVG diagram
   */
  async imageGeneratorCode(class_or_course_name, query, context) {
    try {
      console.log('Starting diagram generation for query:', query);
      
      // For testing, if Claude API key isn't set, return a placeholder SVG
      if (!process.env.ANTHROPIC_API_KEY) {
        console.log('Using placeholder diagram (Claude API key not configured)');
        return this._generatePlaceholderSVG(query);
      }
      
      // Create the system prompt for diagram generation
      const systemPrompt = `You are an expert at creating educational SVG diagrams. 
Create a clear, accurate educational diagram that helps explain the concept.
Your diagram must use proper SVG syntax and be well-structured.
The diagram should be educational, visually appealing, and help students understand the concept.`;
      
      // Construct the API request based on the latest Anthropic API format
      const requestData = {
        model: "claude-3-5-sonnet-20240620",  // Updated model version
        max_tokens: 4000,
        temperature: 0.2,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Create an educational SVG diagram about: ${query}

Use this context to create an informative, accurate diagram:
${context}

Requirements:
1. The diagram should be in proper SVG format with viewBox="0 0 800 600"
2. Include clear labels, arrows, and visual elements that help explain the concept
3. Use appropriate colors, shapes, and typography
4. Make sure all text is readable and all elements are properly positioned
5. The diagram should be educational and suitable for students

Please provide ONLY the complete SVG code without any explanations.`
          }
        ]
      };
      
      console.log('Sending request to Claude API...');
      console.log('Using model:', requestData.model);
      
      // Make the API request
      const response = await this.client.post('/v1/messages', requestData);
      
      console.log('Claude response received');
      
      // Extract the SVG code from the response
      const messageContent = response.data.content[0].text;
      
      // Find the SVG tag content
      const svgMatch = messageContent.match(/<svg[^>]*>[\s\S]*?<\/svg>/i);
      
      if (svgMatch && svgMatch[0]) {
        const svgCode = svgMatch[0];
        console.log('SVG code extracted successfully');
        
        return {
          status: 'success',
          html_code: svgCode
        };
      } else {
        console.error('No SVG code found in Claude response');
        return this._generatePlaceholderSVG(query);
      }
    } catch (error) {
      console.error('Error in diagram generation:', error.message);
      if (error.response) {
        console.error('API response status:', error.response.status);
        console.error('API response data:', JSON.stringify(error.response.data, null, 2));
      }
      
      // Try with a different model version if first one fails
      if (error.response && error.response.status === 404 && error.response.data?.error?.type === 'not_found_error') {
        return this._tryFallbackModel(query, context, systemPrompt);
      }
      
      // Return placeholder image on error
      return this._generatePlaceholderSVG(query);
    }
  }
  
  /**
   * Try a fallback model if the first one fails
   * @private
   */
  async _tryFallbackModel(query, context, systemPrompt) {
    try {
      console.log('Trying fallback model...');
      
      // Construct the API request with an alternative model
      const requestData = {
        model: "claude-3-opus-20240229",  // Try a different model
        max_tokens: 4000,
        temperature: 0.2,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Create an educational SVG diagram about: ${query}

Use this context to create an informative, accurate diagram:
${context}

Requirements:
1. The diagram should be in proper SVG format with viewBox="0 0 800 600"
2. Include clear labels, arrows, and visual elements that help explain the concept
3. Use appropriate colors, shapes, and typography
4. Make sure all text is readable and all elements are properly positioned
5. The diagram should be educational and suitable for students

Please provide ONLY the complete SVG code without any explanations.`
          }
        ]
      };
      
      console.log('Using fallback model:', requestData.model);
      
      // Make the API request
      const response = await this.client.post('/v1/messages', requestData);
      const messageContent = response.data.content[0].text;
      
      // Find the SVG tag content
      const svgMatch = messageContent.match(/<svg[^>]*>[\s\S]*?<\/svg>/i);
      
      if (svgMatch && svgMatch[0]) {
        const svgCode = svgMatch[0];
        console.log('SVG code extracted successfully from fallback model');
        
        return {
          status: 'success',
          html_code: svgCode
        };
      } else {
        console.error('No SVG code found in fallback model response');
        return this._generatePlaceholderSVG(query);
      }
    } catch (error) {
      console.error('Fallback model also failed:', error.message);
      return this._generatePlaceholderSVG(query);
    }
  }

  /**
   * Generate a placeholder SVG image when Claude is unavailable
   * @param {string} query - The user's question
   * @returns {Object} - SVG placeholder
   * @private
   */
  _generatePlaceholderSVG(query) {
    const sanitizedQuery = this._sanitizeText(query);
    const words = sanitizedQuery.split(' ');
    
    // Create acronym from first letters of words
    const acronym = words
      .filter(word => word.length > 3)  // Only use significant words
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 3);  // Limit to 3 letters
    
    // Generate a random pastel color
    const hue = Math.floor(Math.random() * 360);
    const pastelColor = `hsl(${hue}, 70%, 80%)`;
    const darkColor = `hsl(${hue}, 70%, 40%)`;
    
    const svgCode = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <title>Educational Diagram: ${sanitizedQuery}</title>
  <desc>A placeholder diagram about ${sanitizedQuery}</desc>
  
  <!-- Background -->
  <rect width="800" height="600" fill="${pastelColor}" />
  
  <!-- Center circle -->
  <circle cx="400" cy="300" r="150" fill="white" />
  
  <!-- Text -->
  <text x="400" y="300" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="${darkColor}" text-anchor="middle" dominant-baseline="central">${acronym}</text>
  
  <!-- Title -->
  <rect x="100" y="500" width="600" height="60" rx="10" fill="white" opacity="0.9" />
  <text x="400" y="540" font-family="Arial, sans-serif" font-size="24" fill="${darkColor}" text-anchor="middle" dominant-baseline="central">
    Educational Diagram: ${sanitizedQuery.substring(0, 40)}${sanitizedQuery.length > 40 ? '...' : ''}
  </text>
</svg>`;

    return {
      status: 'success',
      html_code: svgCode
    };
  }

  /**
   * Sanitize text for use in SVG attributes
   * @param {string} text - The text to sanitize
   * @returns {string} - Sanitized text
   * @private
   */
  _sanitizeText(text) {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

module.exports = { ClaudeClient };