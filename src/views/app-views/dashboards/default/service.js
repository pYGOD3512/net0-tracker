import axios from 'axios';
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const API_URL = process.env.REACT_APP_OPENAI_URL;  

const fetchMitigationMeasures = async (last5YearsData, totalEmissions, totalMitigations) => {


  const prompt = `
    Here is the emission and mitigation data for the last 5 years:
    ${JSON.stringify(last5YearsData)}
    Total Emissions: ${totalEmissions}
    Total Mitigations: ${totalMitigations}

    Analyze these data trends, talk about how they're behaving over the years and provide possible mitigation measures if possible give example to reduce the emissions 
    so we can head towards net zero. Be detailed and straight forward, provide you answer in points and a brief explanations to them
  `;

  const requestBody = {
    model: 'gpt-4',  // or 'gpt-4' if you are using GPT-4
    messages: [
      {
        role: 'system',
        content: 'You are an expert in environmental science and mitigation strategies.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    max_tokens: 1000  // Adjust the token limit as needed
  };

  try {
    const response = await axios.post(API_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      }
    });

    if (response.status === 200) {
      return response.data.choices[0].message.content;  // Adjust based on API response structure
    } else {
      console.error(`Error: Received status code ${response.status}`);
      return 'Failed to fetch mitigation measures';
    }
  } catch (error) {
    console.error('API request failed:', error.response ? error.response.data : error.message);
    return 'Failed to fetch mitigation measures';
  }
};

export default fetchMitigationMeasures;


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
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',  // Use GPT-4 or whichever model you prefer
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
    throw new Error('Failed to fetch AI response. Please try again later.');
  }
};