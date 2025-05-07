const AWS = require('aws-sdk');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

/**
 * BedrockClient class for AWS Bedrock integration
 * Handles image generation for educational content
 */
class BedrockClient {
  constructor() {
    this.initializeBedrockClient();
  }

  /**
   * Initialize AWS Bedrock client with credentials
   */
  initializeBedrockClient() {
    // Configure AWS SDK with credentials
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION || 'us-east-1'
    });

    // Initialize Bedrock client and runtime
    this.bedrock = new AWS.Bedrock();
    this.bedrockRuntime = new AWS.BedrockRuntime();
  }

  /**
   * Generate an educational image using AWS Bedrock
   * @param {string} class_or_course_name - Context about the educational topic
   * @param {string} query - The user's question
   * @param {string} context - Additional context or formatted response
   * @returns {Object} - The generated image response
   */
  async imageGeneratorCode(class_or_course_name, query, context) {
    try {
      // Define the image generation prompt
      const imagePrompt = `
Your task is to create a 100% accurate, visually advanced, and educational SVG diagram. The diagram must be technically precise, highly engaging, and educational.

### Topic for the accurate and visually pleasing diagram:
${query}

### Additional context:
${context}

### Guidelines:
- Create an educational illustration that visually explains the topic
- Use clear, labeled components with educational value
- Ensure scientific/factual accuracy for all elements
- Use a pleasing, well-balanced color palette
- Include clear headings and labels where appropriate
- Make sure all text is legible and properly positioned
- Design at an appropriate educational level for the topic

The diagram should help students visualize and understand this educational concept.
`;

      // Call Stability AI model through Bedrock for SVG generation
      const params = {
        modelId: 'stability.stable-diffusion-xl',
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          text_prompts: [
            {
              text: imagePrompt,
              weight: 1.0
            }
          ],
          cfg_scale: 7,
          steps: 50,
          width: 1024,
          height: 768,
          seed: Math.floor(Math.random() * 4294967295), // Random seed for variety
          style_preset: "digital-art"
        })
      };

      // Invoke the model
      const response = await this.bedrockRuntime.invokeModel(params).promise();
      const responseBody = JSON.parse(Buffer.from(response.body).toString());

      // Process the response to extract the image
      if (responseBody.artifacts && responseBody.artifacts.length > 0) {
        // Get the image as base64
        const base64Image = responseBody.artifacts[0].base64;
        
        // Create SVG wrapper
        const svgCode = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="768" viewBox="0 0 1024 768">
  <title>Educational Illustration: ${this._sanitizeText(query)}</title>
  <desc>An educational illustration about ${this._sanitizeText(query)}</desc>
  <image width="1024" height="768" href="data:image/png;base64,${base64Image}" />
</svg>`;

        return {
          status: 'success',
          html_code: svgCode
        };
      } else {
        return {
          status: 'error',
          html_code: `Unable to create the diagram for ${query} because the model did not return an image`
        };
      }
    } catch (error) {
      console.error('Error in image generation:', error);
      return {
        status: 'error',
        html_code: `Unable to create the diagram for ${query} because of an error: ${error.message}`
      };
    }
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

  /**
   * Generate a table visualization using Bedrock
   * @param {string} class_or_course_name - Context about the educational topic
   * @param {string} query - The user's question
   * @param {string} context - Additional context or formatted response
   * @returns {Object} - The generated table HTML
   */
  async tableGeneratorCode(class_or_course_name, query, context) {
    try {
      // Call AWS Bedrock with Claude model for generating HTML tables
      const params = {
        modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 4000,
          temperature: 0.2,
          messages: [
            {
              role: "system",
              content: `You are an educational table generator. Your task is to create informative, well-structured HTML tables based on educational topics and questions. The tables should be clearly organized with proper headers, rows, and columns.`
            },
            {
              role: "user", 
              content: `Create an educational HTML table about: ${query}\n\nContext: ${context}`
            }
          ]
        })
      };

      // Invoke the model
      const response = await this.bedrockRuntime.invokeModel(params).promise();
      const responseBody = JSON.parse(Buffer.from(response.body).toString());
      
      // Extract the table HTML from the response
      const tableContent = responseBody.content[0].text;
      
      // Find the HTML table in the response
      const tableRegex = /<table[\s\S]*?<\/table>/i;
      const tableMatch = tableContent.match(tableRegex);
      
      if (tableMatch && tableMatch[0]) {
        return {
          html_code: tableMatch[0]
        };
      } else {
        return {
          status: 'error',
          html_code: `Unable to create the table for ${query} because no valid table was generated`
        };
      }
    } catch (error) {
      console.error('Error in table generation:', error);
      return {
        status: 'error',
        html_code: `Unable to create the table for ${query} because of an error: ${error.message}`
      };
    }
  }
}

module.exports = { BedrockClient };