import axios from 'axios';

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const API_URL = process.env.REACT_APP_OPENAI_URL;  


/**
 * Formats the energy emissions data into a readable string format.
 * @param {Array} data - The energy emissions data array.
 * @returns {string} - A formatted string representation of the data.
 */
const formatEnergyEmissionsData = (data) => {
    return data.map(item => {
      return `Year: ${item.Year}, Power Sector: ${item["Power sector/GWh"]} GWh, Thermal: ${item["Thermal/GWh"]} GWh, Renewable: ${item["Renewable/GWh"]} GWh, Hydro: ${item["Hydro/GWh"]} GWh`;
    }).join('\n');
  };
  
  export const fetchAIResponse = async (userPrompt, energyEmissions) => {
  
    // Format the energy emissions data
    const formattedData = formatEnergyEmissionsData(energyEmissions);
  
    // Construct a system message with the formatted energy emissions data
    const systemMessage = {
      role: 'system',
      content: `You are an AI assistant specialized in analyzing energy emissions data. You have access to the following data:\n\n${formattedData}\n\nYou can answer user queries related to this data, general climate topics, and mitigation strategies. Respond based on the context of the query.`
    };
  
    // Construct the user message with the user's prompt
    const userMessage = {
      role: 'user',
      content: userPrompt
    };
  
    // API request to fetch the AI's response
    try {
      const response = await axios.post(
        API_URL,
        {
          model: 'gpt-3.5-turbo', 
          messages: [systemMessage, userMessage],
          max_tokens: 500,  // Adjust token limit as needed
          temperature: 0.7  // Adjust temperature for response variability
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          }
        }
      );
  
      // Extract and return the AI's response
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error fetching AI response:', error);
      throw new Error('An error occured (Check internet connection)');
    }
  };