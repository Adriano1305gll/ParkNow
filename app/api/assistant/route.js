import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { question } = await request.json();

    if (!question?.trim()) {
      return Response.json(
        { error: 'Please enter a question.' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    );

    const { data: spaces, error } = await supabase
      .from('parking_spaces')
      .select('space_number, status')
      .eq('parking_lot_id', 1)
      .order('space_number', { ascending: true });

    if (error) {
      return Response.json(
        { error: 'Unable to read parking data.' },
        { status: 500 }
      );
    }

    const availableSpaces = spaces
      .filter((space) => space.status === 'available')
      .map((space) => space.space_number);

    const occupiedSpaces = spaces
      .filter((space) => space.status === 'occupied')
      .map((space) => space.space_number);

    const parkingData = {
      facility: 'Central Garage',
      totalSpaces: spaces.length,
      availableCount: availableSpaces.length,
      occupiedCount: occupiedSpaces.length,
      occupancyRate:
        spaces.length > 0
          ? Math.round((occupiedSpaces.length / spaces.length) * 100)
          : 0,
      availableSpaces,
      occupiedSpaces,
    };

    const response = await openai.responses.create({
      model: 'gpt-5.6-luna',

      instructions: `
You are Park Now Assistant.

Your job is to help drivers understand the current parking situation
at Central Garage.

Rules:
- Use ONLY the live parking data provided.
- Never invent an available parking space.
- If asked where to park, recommend an actually available space.
- Keep answers short, clear, and useful.
- If the question cannot be answered from the parking data, say so.
- Do not claim that a space will remain available in the future.
`,

      input: `
LIVE PARKING DATA:
${JSON.stringify(parkingData)}

USER QUESTION:
${question}
`,
    });

    return Response.json({
      answer: response.output_text,
      parkingData,
    });
  } catch (error) {
    console.error('Park Now AI error:', error);

    return Response.json(
      { error: 'The AI assistant is temporarily unavailable.' },
      { status: 500 }
    );
  }
}
