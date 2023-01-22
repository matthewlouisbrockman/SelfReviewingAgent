import { callOpenAI } from '../models/callOpenai';

const evalPriorPrompt = (idea: string): string => {
  return `//NOTE: THIS IS MEANT FOR PYTHON CONVERSION SO KEYS NEED TO BE IN QUOTES ("KEY": "VALUE")
interface aiMentalState{
"currentThought": string, // copies the prior mental state, then assesses the prior mental state and assesses what might happen next and plans how things might go.. 
"possibleActions": [ //DO NOT CHANGE FROM INPUT; these are actions the bot *might* do
  {
    "print": string,
    "confidence": number
  }] | [],
"actionToTake": [ //DO NOT CHANGE FROM INPUT; these are actions the bot *should* do
  {
    "print": string,
    "confidence": number
  }] | []
  ]
"takenActions": [ //DO NOT CHANGE FROM INPUT; these are actions the bot *has* done
  {
    "print": string,
    "confidence": number
  }] | []
  ]
}
  
const think = () =>:string => {
  /* 
  the AI evaluates what previously happened (what the user said and what it said and thought) and whether it has any new tasks to do.
  Note: if this is all "I think / I said" without "the user said" the AI thought should be about what previously happened and thinking about why the user didn't respond
  Statements by the user begin with [user]
  Statements by the AI begin with [bot]
  the conversation might go like,
  [user, verbal] hi
  [bot, verbal] hi
  [bot, thinking] I think I last said hi. I wonder if the user will respond
  */
  return(\`[thought] I think I last said \${ai.lastAIOutput}. I should \${ai.recentUserInput() ? ai.newIdeasOnRecievedInput(currentIdeas) : ai.newIdeasAwaitingUserInput(currentIdeas)}\`)
}

>> currentHistory = \`${idea}\`
>> console.log(think())
Out:
[thought] I think`;
};

export const linearExpander = async (idea: string): Promise<any> => {
  const newPrompt = evalPriorPrompt(idea);
  const data = await callOpenAI({ text: newPrompt, temperature: 0.2 });
  if (data.error) {
    return data;
  }
  const outputText = `I think${data.choices[0].text}`;
  return {
    thought: outputText,
    prompt: `${newPrompt}...\n${outputText}`,
  };
};
