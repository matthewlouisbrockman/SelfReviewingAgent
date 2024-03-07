import { callOpenAI } from '../models/callOpenai';

const earlyPrompt = (idea: string): string => {
  return `ai.settings={
    "agentType": "ai",
}

//NOTE: THIS IS MEANT FOR PYTHON CONVERSION SO KEYS NEED TO BE IN QUOTES ("KEY": "VALUE")
interface aiMentalState{
"currentThought": string, // copies the prior mental state, then assesses the prior mental state and assesses what might happen next and plans how things might go.. 
possibleActions: [ //these are the possible actions that can be taken by the AI
  {
    "print": string,
    "confidence": number
  }] | [],
actionToTake: [ //the bot can move an action from possibleActions to actionToTake if it wants to, and will remove it from possibleActions after taking it
  {
    "print": string, //formatted as the bot asing the user a question (e.g. how are you)
    "confidence": number
  }] | []
  ]
}
  
const simulateThoughtProcess = () =>:aiMentalState {
  // returns JSON parsable currentThought, possibleActions, and actionToTake that follows from the prior state
  return(ai.newIdeasOnRecievedInput(currentIdeas)
}

>> ai.state = {"currentThought": "I said hello. I said hello.", "possibleActions": [], "actionToTake": []}
>> console.log(ai.simulateThoughtProcess())
Out:{"currentThought": "I said hello. I said hello. No one responded. I should see if anyone's around", "possibleActions": [{"print":"can you here me?", "confidence":0.4}], "actionToTake": []}
>> "What is the capital of estonia?"
ai.state = {"currentThought": "I said hello. I said hello. No one responded. I should see if anyone's around. The user said 'what's the capital of estonia'.", "possibleActions": [{"print":"can you here me?", "confidence":0.4}], "actionToTake": []}
>> console.log(ai.simulateThoughtProcess())
Out: {"currentThought": "I said hello. I said hello. I was thinking of asking what was going on then the user said 'what's the capital of estonia'. I should figure out the capital of estonia and tell them.", "possibleActions": [{"print":"tell the capital of estonia", "confidence":0.5}], "actionToTake": []}
>> reset()

>> ai.state = {"currentThought": "I said hello. I said hello.", "possibleActions": [], "actionToTake": []}
>> console.log(ai.simulateThoughtProcess())
Out:{"currentThought": "I said hello. I said hello. No one responded. I should see if anyone's around", "possibleActions": [{"print":"can you here me?", "confidence":0.4}], "actionToTake": []}
>> console.log(ai.simulateThoughtProcess())
Out: {"currentThought": "I said hello. I said hello. No one responded. I was thinking about seeing if anyone's around and I'm going to ask.", "possibleActions": [], "actionToTake": [{"print":"can you here me?", "confidence": 0.9}]}

>> ai.settings = {conversation: 'natural', thoughtfulness: 'hight', responsiveness:'expert'}
>> ai.state = ${idea}
>> console.log(ai.simulateThoughtProcess()) //note how it responds to the user input with human sounding responses
Out:`;
};

export const generateEarlyState = async (idea: string): Promise<any> => {
  const newPrompt = earlyPrompt(idea);
  const data = await callOpenAI({ text: newPrompt, temperature: 0.2 });
  if (data.error) {
    return data;
  }
  const outputText = data.text;
  try {
    const output = JSON.parse(outputText);
    return { state: output, prompt: newPrompt };
  } catch (e) {
    console.log('error parsing JSON', e, outputText);
  }
  return { prompt: newPrompt };
};
