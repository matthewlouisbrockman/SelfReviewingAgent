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
  
const summarizer = () =>:string => {
  /* 
    returns a summary of how the conversation is going, the last thing it said, the last thing the user said, what it's been thinking about, if there's repetition or the conversation is going in circles, etc.
  */
  return(\`[thought]: I was thinking \${ai.summarize(currentIdeas)}\`. This means \${ai.evaluate(currentIdeas)})\`)
}

>> ai.state = ${idea}
>> console.log(summarizer())
Out:
[thought] :`;
};

export const linearSummarizer = async (
  idea: string,
  apikey: string = ''
): Promise<any> => {
  const newPrompt = evalPriorPrompt(idea);
  const data = await callOpenAI({
    text: newPrompt,
    temperature: 0.2,
    key: apikey,
  });
  if (data.error) {
    return data;
  }
  const outputText = `The TLDR of the previous lines is:${data.choices[0].text}`;
  return {
    thought: outputText,
    prompt: `${newPrompt}...\n${outputText}`,
  };
};
