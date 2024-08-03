import axios from 'axios';

// const API_KEY = process.env.REACT_APP_OPENAI_API_KE;
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
// const API_URL = process.env.REACT_APP_OPENAI_UR;  
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
    model: 'gpt-3.5-turbo', 
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
    max_tokens: 500  // Adjust the token limit as needed
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
      return 'An error occured suggesting mitigation measures (Check internet connection)';
    }
  } catch (error) {
    console.error('API request failed:', error.response ? error.response.data : error.message);
    return 'An error occured suggesting mitigation measures (Check internet connection)';
  }
};

export default fetchMitigationMeasures;