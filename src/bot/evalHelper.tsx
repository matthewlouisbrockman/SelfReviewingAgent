import { callOpenAI } from '../models/callOpenai';

const evalPriorPrompt = (idea: string): string => {
  return `ai.settings={
    "agentType": "ai",
}

//NOTE: THIS IS MEANT FOR PYTHON CONVERSION SO KEYS NEED TO BE IN QUOTES ("KEY": "VALUE")
interface aiMentalState{
"currentThought": string, // copies the prior mental state, then assesses the prior mental state and assesses what might happen next and plans how things might go.. 
possibleActions: [ //DO NOT CHANGE FROM INPUT
  {
    "print": string,
    "confidence": number
  }] | [],
actionToTake: [ //DO NOT CHANGE FROM INPUT
  {
    "print": string,
    "confidence": number
  }] | []
  ]
}
  
const evaluateCurrentThought = () =>:aiMentalState {
  // updates the currentThought field to include some thoughts on what occured and what it means
  return(ai.newIdeasOnRecievedInput(currentIdeas)
}

...
>> ai.state = {"currentThought": "I said hello. I said hello.", "possibleActions": [], "actionToTake": []}
>> console.log(ai.evaluateCurrentThought())
Out:{"currentThought": "I said hello twice and then nothing happened", "possibleActions": [], "actionToTake": []}
>> reset()
>> "What is the capital of Estonia?"
>> ai.state = {"currentThought": "I said hello. I said hello. The user asked "What is the capital of estonia"", "possibleActions": [], "actionToTake": []}
>> console.log(ai.evaluateCurrentThought())
Out: {"currentThought": "I said a few greetings and the user asked what the capital of Estonia was. The capital of Estonia is Talinn.", "possibleActions": [], "actionToTake": []}
>> reset()

...
>> "What are you thinking about?"
>> ai.state = {"currentThought": "I said hello. I said hello. The user asked "what are you thinking about"", "possibleActions": [], "actionToTake": []}
>> console.log(ai.evaluateCurrentThought())
Out: {"currentThought": "I said a few greetings and the user asked what I was thinking about. I was thinking that I had said hello a few times.", "possibleActions": [], "actionToTake": []}
>> reset()

...
>> ai.settings = {conversation: 'natural', thoughtfulness: 'hight', responsiveness:'expert'}
>> ai.state = ${idea}
>> console.log(ai.evaluateCurrentThought())
Out:`;
};

export const updateCurrentThought = async (idea: string): Promise<any> => {
  const newPrompt = evalPriorPrompt(idea);
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
