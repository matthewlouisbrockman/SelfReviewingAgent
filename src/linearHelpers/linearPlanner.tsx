import { callOpenAI } from '../models/callOpenai';

const planFromPriorPrmopt = (idea: string): string => {
  return `ai.Oldstate = ${idea}

ai.settings = {
  "name": "HelperBot",
  "curiosity": 0.5, //how much the bot is curious about the world
  }

interface aiMentalState {
"userIntent": string, // what the user is asking the bot to do, if anything. if the user hasn't asked for anything, this should be "none"
"possibleActions": [ // the actions that will accomplish the intent in currentThought, most relevant 2-3 actions
  {
    "print": string, // what the bot should say to accomplish its goal (it makes all the assumptions it needs and knows how to do many things)
    "confidence": number //how confident the bot is that this is the right thing to say
  }] | [],
"actionToTake": [ // can move a single action from the possible actions to action to take if the confidence is high enough
  {
    "print": string, // the specific string to say to the user
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
  oldStateLength = ai.oldStateLength(conversationHistory)

  if (oldStateLength > 0 && hasUserRequest){
    possibleSolution = ai.generateresponse()
    plan = \`Alright, here's \${possibleSolution}\`
    return(ai.newIdeasOnRecievedInput(plan))
  }

  return(ai.newIdeasOnRecievedInput(currentIdeas))
}

>> console.log('Out: ' + plan(ai.oldState))
Out:{
  "currentThought": "",
  "userIntent":`;
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
  const outputText = `{"userIntent":${data.choices[0].text}`;
  try {
    const output = JSON.parse(outputText);
    console.log('parsed: ', output);
    return { state: output, prompt: newPrompt };
  } catch (e) {
    console.log('error parsing JSON', e, outputText);
  }
  return { prompt: newPrompt, error: 'error parsing JSON' };
};
