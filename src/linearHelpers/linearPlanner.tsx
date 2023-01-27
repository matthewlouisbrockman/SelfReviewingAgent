import { callOpenAI } from '../models/callOpenai';

const planFromPriorPrmopt = (idea: string): string => {
  return `//NOTE: THIS IS MEANT FOR PYTHON CONVERSION SO KEYS NEED TO BE IN QUOTES ("KEY": "VALUE")
interface aiMentalState{
"possibleActions": [ // actions the user might do to accopmlish the currentThought
  {
    "print": string, // the specific string to say to the user
    "confidence": number //how confident the bot is that this is the right thing to say
  }] | [],
"actionToTake": [ // can move a single action from the possible actions to action to take if the confidence is high enough
  {
    "print": string, // the specific string to say to the user
    "confidence": number //how confident the bot is that this is the right thing to say
  }] | []
  ]
"takenActions": [ //DO NOT CHANGE FROM INPUT; these are actions the bot *has* done
  {
    "print": string,
    "confidence": number
  }] | []
  ]
}
  
const plan = () =>:aiMentalState => {
  /* 
  update the possibleActions and actions to take if it thinks it should do something (e.g. if the user asked a question, it should first add it to possibleActions, once the state is possible it can then move it to actionsToTake.)
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
