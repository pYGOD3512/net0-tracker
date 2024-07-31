import axios from 'axios';

const fetchMitigationMeasures = async (last5YearsData, totalEmissions, totalMitigations) => {
  const API_URL = 'https://api.openai.com/v1/chat/completions';  // or the appropriate OpenAI endpoint

  const prompt = `
    Here is the emission and mitigation data for the last 5 years:
    ${JSON.stringify(last5YearsData)}
    Total Emissions: ${totalEmissions}
    Total Mitigations: ${totalMitigations}

    Analyze these data trends and provide possible mitigation measures to reduce the emissions so we can head towards net zero. List the suggested mitigations in paragraphs and make them short and descriptive
  `;

  const requestBody = {
    prompt: prompt,
    max_tokens: 150,  // Adjust the token limit as needed
  };

  try {
    const response = await axios.post(API_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      }
    });

    if (response.status === 200) {
      return response.data.choices[0].text;
    } else {
      console.error(`Error: Received status code ${response.status}`);
      return 'Failed to fetch mitigation measures';
    }
  } catch (error) {
    console.error('API request failed:', error);
    return 'Failed to fetch mitigation measures';
  }
};

export default fetchMitigationMeasures;
