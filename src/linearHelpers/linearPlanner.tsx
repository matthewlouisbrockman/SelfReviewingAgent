import { callOpenAI } from '../models/callOpenai';

const planFromPriorPrmopt = (idea: string): string => {
  return `//NOTE: THIS IS MEANT FOR PYTHON CONVERSION SO KEYS NEED TO BE IN QUOTES ("KEY": "VALUE")
interface aiMentalState{
"possibleActions": [ // the actions that will accomplish the intent in currentThought
  {
    "print": string, // what the bot should say to accomplish its goal (it makes all the assumptions it needs and knows how to do many things)
    "confidence": number //how confident the bot is that this is the right thing to say
  }] | [],
"intent": string, // A summary of the possible actions it might take
"actionToTake": [ // can move a single action from the possible actions to action to take if the confidence is high enough
  {
    "print": string, // the specific string to say to the user
    "confidence": number //how confident the bot is that this is the right thing to say
  }] | []
  ]
}
  
const plan = () =>:aiMentalState => {
  /* 
  update the possibleActions and actions to take if it thinks it should do something (e.g. if the user asked a question, it should first add it to possibleActions, once the state is possible it can then move it to actionsToTake.)
  the AI is very helpful and tries to fully answer the user's requests, it's amazing how smart it is, e.g. if the user asks what is 1+1, the ai tries to respond with it. Likewise, if it asks for content, it writes it fully.
  */
  return(ai.newIdeasOnRecievedInput(currentIdeas))
}

>> ai.state = ${idea}
>> console.log('Out: ' + plan())
Out:`;
};

export const linearPlanner = async (
  idea: string,
  key: string
): Promise<any> => {
  const newPrompt = planFromPriorPrmopt(idea);
  const data = await callOpenAI({ text: newPrompt, temperature: 0.2, key });
  if (data.error) {
    return data;
  }
  const outputText = data.choices[0].text;
  try {
    const output = JSON.parse(outputText);
    return { state: output, prompt: newPrompt };
  } catch (e) {
    console.log('error parsing JSON', e, outputText);
  }
  return { prompt: newPrompt, error: 'error parsing JSON' };
};
