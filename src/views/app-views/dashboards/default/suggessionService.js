import axios from 'axios';
import { notification } from 'antd';

// const API_KEY = process.env.REACT_APP_OPENAI_API_KE;
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
// const API_URL = process.env.REACT_APP_OPENAI_UR;  
const API_URL = process.env.REACT_APP_OPENAI_URL;  

const fetchMitigationMeasures = async (energyData) => {

  const prompt = `

    I have a dataset ${energyData} containing emissions data over a specified period of a country. Please analyze this data carefully, focusing on the following aspects:

    1. **Trend Analysis:** Identify and describe any significant trends or patterns in the emissions data over the period. Highlight any increases, decreases, or periods of stability.

    2. **Impact Assessment:** Evaluate how the observed trends might impact the overall emissions levels. Discuss any potential causes for these trends and their implications.

    3. **Mitigation Measures:** Based on the trends and data analysis, suggest the best mitigation measures to help reduce emissions. Include specific strategies or actions that could be implemented to achieve a net-zero emissions goal. based on the data and trend you can give example if any

    4. **Recommendations:** Provide actionable recommendations tailored to the data, considering factors such as feasibility, cost, and potential effectiveness. 

    The dataset includes information on various types of emissions, sources, and any relevant context that might influence the results.

    Please ensure that your analysis is detailed and provides practical suggestions for achieving net-zero emissions.

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
    notification.error({
      message: 'Uh, ooh!',
      description: 'An error occured whiles analyzing and suggesting mitigations measures, please check connectiona and try again',
  });
    return 'An error occured suggesting mitigation measures (Check internet connection)';
  }
};

export default fetchMitigationMeasures;