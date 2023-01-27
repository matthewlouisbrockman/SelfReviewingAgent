import { callOpenAI } from '../models/callOpenai';

const evalPriorPrompt = (idea: string): string => {
  return `const summarizer = () =>:string => {
  /* 
    returns a summary of how the conversation is going, the last thing it said, the last thing the user said, what it's been thinking about. If there's been repition, it should evaluate how to get out of the loops
    The conversation is in the form
    Memory # [ai | user, thought | said]: [text],

    where the memories are numbered in chronological order, oldest to newest

  */

  lastUserRequest = ai.lastUserRequest()

  summary = ai.summarize(currentIdeas)

  //if the AI is repeating itself or the user hasn't responded to the last thing it said, it should evaluate how to get out of the loop
  if (utils.isRepeating(currentIdeas) || !currentIdeas.answers(lastUserRequest){
    solution = ai.howToGetOutOfLoop(currentIdeas)
    return(\`[thought]: I was thinking \${summary}. I should \${solution}\`)
  }
  //otherwise, it just returns a summary of the conversation so far
  else {
    return(\`[thought]: I was thinking \${summary}\`)
  }
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
  const outputText = data.choices[0].text;
  return {
    thought: outputText,
    prompt: `${newPrompt}...\n${outputText}`,
  };
};
