import Anthropic from '@anthropic-ai/sdk';
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  text: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // parse the request
  const { text, key, ...props } = req.body;

  const anthropic = new Anthropic({
    apiKey: key,
  });

  try {
    const msg = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      temperature: 0,
      system:
        'You are a helpful AI that completes whatever output the user started writing without repeating it.',
      messages: [
        {
          role: 'user',
          content: text,
        },
      ],
      ...props,
    });
    const responseText = msg?.content?.[0]?.text;
    res.status(200).json({ text: responseText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ text: 'An error occurred' });
  }
}
