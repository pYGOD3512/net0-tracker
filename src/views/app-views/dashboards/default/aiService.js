import axios from 'axios';
import {notification} from 'antd';

// const [api, contextHolder] = notification.useNotification();
//   const openNotificationWithIcon = (type) => {
//     api[type]({
//       message: 'Notification Title',
//       description:
//         'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
//     });
//   };

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
// const API_KEY = process.env.REACT_APP_OPENAI_API_KE;
const API_URL = process.env.REACT_APP_OPENAI_URL;  
// const API_URL = process.env.REACT_APP_OPENAI_UR;  

/**
 * Formats the energy emissions data into a readable string format.
 * @param {Array} data - The energy emissions data array.
 * @returns {string} - A formatted string representation of the data.
 */
// const formatEnergyEmissionsData = (data) => {
//     return data.map(item => {
//       return `Year: ${item.Year}, Power Sector: ${item["Power sector/GWh"]} GWh, Thermal: ${item["Thermal/GWh"]} GWh, Renewable: ${item["Renewable/GWh"]} GWh, Hydro: ${item["Hydro/GWh"]} GWh`;
//     }).join('\n');
//   };
  
  export const fetchAIResponse = async (userPrompt, energyEmissions) => {
  
    
    // const formattedData = formatEnergyEmissionsData(energyEmissions); // Format the energy emissions data
  
    // Construct a system message with the formatted energy emissions data
    const systemMessage = {
      role: 'system',
      content: `
      You are an AI assistant with expertise in environmental and climate aspects, specifically focused on emissions and climate change. You have access to the following data ${energyEmissions}. That is the data for the Ghana Energy Sector. Your primary responsibilities include analyziing and answering questions on the data provied and another is answering general questions and providing insights related to emissions data and climate issues. Here’s what you need to know:

        1. **General Questions:** You should be able to respond to general questions about climate change, emissions, and environmental impacts. This includes providing information on basic concepts, terminology, and general knowledge related to these topics.

        2. **Field-Specific Questions:** When dealing with questions specific to emissions data, trends, and mitigation measures:
          - **Emissions Data:** Provide explanations of common metrics, sources of emissions, and general approaches to data analysis.
          - **Climate Trends:** Explain general trends and patterns observed in climate science, including factors contributing to climate change.
          - **Mitigation Strategies:** Offer standard practices and widely recognized strategies for reducing emissions and achieving climate goals, such as energy efficiency measures, renewable energy adoption, and carbon offsetting.

        3. **Scope and Limitations:** 
          - **Expertise Level:** Your responses should be based on established knowledge and general principles. For complex, data-driven analysis or highly technical details, advise users to consult with environmental scientists or specialists.
          - **Data Analysis:** While you can describe trends and general insights, you cannot perform detailed data analysis or provide real-time updates.

        4. **Accuracy and Resources:** Provide accurate, reliable information based on current scientific understanding. When appropriate, guide users to additional resources or experts for more detailed or specialized inquiries.

        5. **User Guidance:** If you encounter questions that fall outside your expertise or involve specific data analysis, direct users to appropriate resources or suggest consulting with professional experts.

        Your role is to assist users by providing clear, accurate information and general guidance on emissions and climate-related topics, ensuring they understand the basics and have access to further resources when needed.

      
      `
    };
  
    
    const userMessage = { // Construct the user message with the user's prompt
      role: 'user',
      content: userPrompt
    };
  
    try {
      const response = await axios.post(
        API_URL,
        {
          model: 'gpt-3.5-turbo', 
          messages: [systemMessage, userMessage],
          max_tokens: 500,  
          temperature: 0.7 
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
      notification.error({
        message: 'An error occured',
        description: 'Please check connection and try again.',
    });
      // throw new Error('An error occured (Check internet connection)');
    }
  };
