const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

/**
 * OpenAIImageClient class for OpenAI image generation
 * Handles image generation for educational content
 */
class OpenAIImageClient {
  constructor() {
    this.initialize();
  }

  /**
   * Initialize OpenAI API client
   */
  initialize() {
    console.log('Initializing OpenAI image client...');
    
    // Check if OpenAI API key is set
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY is not set. Image generation will use placeholders.');
    } else {
      console.log('OpenAI API key is configured');
    }
    
    // Configure axios instance for OpenAI API
    this.api = axios.create({
      baseURL: 'https://api.openai.com/v1',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Generate an educational image using OpenAI
   * @param {string} class_or_course_name - Context about the educational topic
   * @param {string} query - The user's question
   * @param {string} context - Additional context or formatted response
   * @returns {Object} - The generated image response
   */
  async generateImage(class_or_course_name, query, context) {
    try {
      console.log('Starting image generation for query:', query);
      
      // If OpenAI API key isn't set, return a placeholder SVG
      if (!process.env.OPENAI_API_KEY) {
        console.log('Using placeholder image (OpenAI API key not configured)');
        return this._generatePlaceholderSVG(query);
      }
      
      // Create a detailed prompt for educational illustration
      const prompt = `Create an educational illustration that clearly explains and visualizes: ${query}. 
      
The illustration should be detailed, accurate, and helpful for understanding educational concepts. 
Include appropriate labels, diagrams, and visual elements.
Make it suitable for educational purposes with clear, professional design.

Topic details: ${context.substring(0, 500)}`;

      console.log('Sending request to OpenAI API...');
      
      // Call OpenAI's DALL-E 3 API
      const response = await this.api.post('/images/generations', {
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url'
      });
      
      console.log('OpenAI response received');
      
      // Extract the image URL from the response
      if (response.data.data && response.data.data.length > 0) {
        const imageUrl = response.data.data[0].url;
        
        // Download the image and convert to base64
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const base64Image = Buffer.from(imageResponse.data).toString('base64');
        
        // Create SVG wrapper
        const svgCode = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <title>Educational Illustration: ${this._sanitizeText(query)}</title>
  <desc>An educational illustration about ${this._sanitizeText(query)}</desc>
  <image width="1024" height="1024" href="data:image/png;base64,${base64Image}" />
</svg>`;

        return {
          status: 'success',
          html_code: svgCode
        };
      } else {
        console.error('No image data returned from OpenAI');
        return this._generatePlaceholderSVG(query);
      }
    } catch (error) {
      console.error('Error in image generation:', error.response?.data || error.message || error);
      
      // Return placeholder image on error
      return this._generatePlaceholderSVG(query);
    }
  }

  /**
   * Generate a placeholder SVG image when OpenAI is unavailable
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
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <title>Educational Illustration: ${sanitizedQuery}</title>
  <desc>A placeholder illustration about ${sanitizedQuery}</desc>
  
  <!-- Background -->
  <rect width="1024" height="1024" fill="${pastelColor}" />
  
  <!-- Center circle -->
  <circle cx="512" cy="512" r="200" fill="white" />
  
  <!-- Text -->
  <text x="512" y="512" font-family="Arial, sans-serif" font-size="120" font-weight="bold" fill="${darkColor}" text-anchor="middle" dominant-baseline="central">${acronym}</text>
  
  <!-- Title -->
  <rect x="112" y="768" width="800" height="60" rx="10" fill="white" opacity="0.9" />
  <text x="512" y="808" font-family="Arial, sans-serif" font-size="24" fill="${darkColor}" text-anchor="middle" dominant-baseline="central">
    Educational Illustration: ${sanitizedQuery.substring(0, 40)}${sanitizedQuery.length > 40 ? '...' : ''}
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

module.exports = { OpenAIImageClient };