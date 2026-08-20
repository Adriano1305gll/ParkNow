import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const { question } = await request.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    );

    const { data: spaces, error } = await supabase
      .from('parking_spaces')
      .select('space_number, status')
      .order('space_number', { ascending: true });

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const available = spaces.filter(
      (space) => space.status === 'available'
    );

    const occupied = spaces.filter(
      (space) => space.status === 'occupied'
    );

    const q = (question || '').toLowerCase();

    let answer;

    if (
      q.includes('available') ||
      q.includes('free') ||
      q.includes('disponible')
    ) {
      answer =
        `${available.length} parking spaces are currently available. ` +
        `Available spaces: ${available
          .map((space) => space.space_number)
          .join(', ')}.`;
    } else if (
      q.includes('occupied') ||
      q.includes('ocupado')
    ) {
      answer =
        `${occupied.length} parking spaces are currently occupied. ` +
        `Occupied spaces: ${occupied
          .map((space) => space.space_number)
          .join(', ')}.`;
    } else if (
      q.includes('where') ||
      q.includes('park') ||
      q.includes('donde') ||
      q.includes('dónde')
    ) {
      if (available.length > 0) {
        answer =
          `You can park in space ${available[0].space_number}. ` +
          `There are ${available.length} spaces available right now.`;
      } else {
        answer = 'There are currently no available parking spaces.';
      }
    } else {
      answer =
        `There are ${spaces.length} total parking spaces, ` +
        `${available.length} available and ${occupied.length} occupied.`;
    }

    return Response.json({
      answer,
      total: spaces.length,
      available: available.length,
      occupied: occupied.length,
    });
  } catch (error) {
    return Response.json(
      { error: 'Assistant request failed.' },
      { status: 500 }
    );
  }
}
