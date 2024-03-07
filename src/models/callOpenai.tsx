import axios from 'axios';

interface OpenAIArgs {
  text: string;
  key?: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string[];
}

let lastOpenAITime = -1;

// default key is OPENAI_API_KEY
const DEFAULT_OPEANI_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export const callOpenAI = async ({
  text,
  key,
  ...props
}: OpenAIArgs): Promise<any> => {
  // check if it's been less than 3 seconds since last call
  if (lastOpenAITime > 0 && Date.now() - lastOpenAITime < 3000) {
    console.log('Too many calls to OpenAI');
    return { error: 'Too many calls to OpenAI' };
  }
  lastOpenAITime = Date.now();

  try {
    const res = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      JSON.stringify({
        model: 'gpt-4-0125-preview',
        messages: [{ role: 'user', content: text }],
        max_tokens: 1500,
        ...props,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key || DEFAULT_OPEANI_KEY}`,
        },
      }
    );

    const response = res.data.choices[0].message.content;

    return { text: response };
  } catch (error) {
    console.error(error);
    return { error };
  }
};
