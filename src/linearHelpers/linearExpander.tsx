import { callOpenAI } from '../models/callOpenai';

const evalPriorPrompt = (idea: string, plans: string): string => {
  return `
  ai.currentPlans = \`${plans}\`

  ai.settings = {
    immediateResponse: true, //doesn't ask for extra information, just provides whatever the person asks for
  }
  
  const think = () =>:string => {
  /* 
  the AI evaluates what previously happened (what the user said and what it said and thought) and whether it has any new tasks to do.
  Note: if this is all "I think / I said" without "the user said" the AI thought should be about what previously happened and thinking about why the user didn't respond
  when the AI is writing, it immediately provides the full content assuming the user wants it immediately (it's printing everything to the console)

  This new version is pretty good at avoiding repeating itself


  Statements by the user begin with [user]
  Statements by the AI begin with [bot]
  the conversation might go like,
  [user, verbal] hi
  [bot, verbal] hi
  [bot, thinking] I think I last said hi. I should follow up with something to find out what they want.

  or

  [bot, verbal] hi
  [user, verbal] write me a [X]
  [bot, thinking] I think the user wants me to write them a [X]. That would go like, '...[WRITES CONTENT]...'

  */

  lastUserRequest = ai.lastUserRequest()
  if (lastUserRequest){
    //the AI just responds to the user request if it has a good response and doesn't need to ask for followup
    bestResponse = ai.bestResponse(lastUserRequest)
    if (bestResponse){
      return ('[thought]: I think I can say ' + bestResponse)
    }
  }

  thoughtProcess = ai.thinkThroughNextStep(currentIdeas)
  return ('[thought]: I think ' + thoughtProcess)

>> currentHistory = \`${idea}\`
>> console.log(think())
Out:
[thought] I think`;
};

export const linearExpander = async (
  idea: string,
  plans: any,
  apikey: string = ''
): Promise<any> => {
  const newPrompt = evalPriorPrompt(
    idea.slice(-2000),
    JSON.stringify(plans).slice(-1000)
  );
  const data = await callOpenAI({
    text: newPrompt,
    temperature: 0.2,
    key: apikey,
  });
  if (data.error) {
    return data;
  }
  const outputText = `I think${data.choices[0].text}`;
  return {
    thought: outputText,
    prompt: `${newPrompt}...\n${outputText}`,
  };
};
