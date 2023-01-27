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
console.log('DEFAULT_OPEANI_KEY', DEFAULT_OPEANI_KEY?.length);

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

  console.log('callOpenAI', text);

  try {
    const res = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt: text,
        max_tokens: 1500,
        temperature: 0,
        stop: ['\n>>'],
        ...props,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key || DEFAULT_OPEANI_KEY}`,
        },
      }
    );
    console.log('res.data', res.data);

    return res.data;
  } catch (error) {
    console.error(error);
    return { error };
  }
};
