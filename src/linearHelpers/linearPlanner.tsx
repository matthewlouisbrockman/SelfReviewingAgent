import { callOpenAI } from '../models/callOpenai';

const planFromPriorPrmopt = (idea: string): string => {
  return `/*
Comes up with a plan for what to do based on the conversation history,

The conversation is in the form
Memory # [ai | user, thought | said]: [text],

where the memories are numbered in chronological order, oldest to newest
*/
  
ai.settings = {
  "name": "HelperBot",
  "curiosity": 0.5, //how much the bot is curious about the world
  }

interface aiMentalState {
"possibleActions": [ // the actions that will accomplish the intent in currentThought, most relevant 2-3 actions
  {
    "print": string, // what the bot should print out for the user (generally a response to the user request or a question)
    "confidence": number //how confident the bot is that this is the right thing to say
  }] | [],
"actionToTake": [ // can move a single action from the possible actions to action to take if the confidence is high enough
  {
    "print": string, // what the bot should print
    "confidence": number //how confident the bot is that this is the right thing to say
  }] | []
  ]
}
  
const plan = () =>:aiMentalState => {
  /* 
  Purpose: update the possibleActions and actions to take if it thinks it should do something (e.g. if the user asked a question, it should first add it to possibleActions, once the state is possible it can then move it to actionsToTake.)
  the AI is very helpful and tries to fully answer the user's requests, it's amazing how smart it is, e.g. whatever the user asks for, the AI writes something that should fulfill the general request.

  Example: e.g. if the user asks for a sentence about writing, the ai responds
  ---
  Alright, here's your sentence: Writing is... 
  ---
  (and fills in the rest of the content)

  If the user asks a questino like, "what's the capital of France?" the ai responds
  ---
  Oh, that's easy: The capital of France is Paris.
  ---

  if the user hasn't asked for anything, the ai might respond
  ---
  Hello, how can I help you?
  ---

  */

  conversationHistory = ai.oldState.currentThought
  hasUserSaidAnything = ai.detectUserSaidAnything(conversationHistory)
  if (!hasUserSaidAnything){
    return(ai.initiateConversation())
  }
  hasUserRequest = ai.detectUserRequest(conversationHistory)
  currentPlanSeeds = ai.oldState.possibleActions
  oldStateLength = ai.oldStateLength(conversationHistory)

  if (oldStateLength > 0 && hasUserRequest){
    possibleSolution = ai.generateresponse(currentPlanSeeds)
    plan = \`Alright, here's \${possibleSolution}\`
    return(ai.newIdeasOnRecievedInput(plan))
  }

  return(ai.newIdeasOnRecievedInput(currentIdeas))
}
>> ai.state = ${idea}
>> console.log('Out: ' + JSON.stringify(plan()))
Out:{
  "possibleActions": [`;
};

export const linearPlanner = async (
  idea: string,
  key: string
): Promise<any> => {
  const newPrompt = planFromPriorPrmopt(idea);
  console.log('newPrompt: ', newPrompt);
  const data = await callOpenAI({ text: newPrompt, temperature: 0.2, key });
  if (data.error) {
    return data;
  }
  const outputText = `{"possibleActions": [${data.text}`;
  try {
    const output = JSON.parse(outputText);
    console.log('parsed: ', output);
    return { state: output, prompt: newPrompt };
  } catch (e) {
    console.log('error parsing JSON', e, outputText);
  }
  return { prompt: newPrompt, error: 'error parsing JSON' };
};
