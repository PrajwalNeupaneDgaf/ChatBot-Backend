import  { GoogleGenerativeAI } from "@google/generative-ai";


const useAi = async (prompt)=>{
const genAI = new GoogleGenerativeAI('AIzaSyDPRrwP9H7EJkonz1r5VF2a1GMUs830Lcc');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const result = await model.generateContent(prompt);
const returnValue = result.response.text();
return {Text:returnValue,data:result}
}

export default useAi