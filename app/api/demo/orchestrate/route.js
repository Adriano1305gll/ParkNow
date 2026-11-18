import {
  DemoInputError,
  MAX_DEMO_REQUEST_BYTES,
  orchestrateDemo,
} from '../../../../lib/demoOrchestrator.mjs';

export const runtime = 'nodejs';

async function readLimitedBody(request) {
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_DEMO_REQUEST_BYTES) {
    throw new DemoInputError('Request must be 8 KB or smaller.');
  }

  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_DEMO_REQUEST_BYTES) {
      await reader.cancel();
      throw new DemoInputError('Request must be 8 KB or smaller.');
    }
    chunks.push(value);
  }

  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder('utf-8', { fatal: true }).decode(body);
}

export async function POST(request) {
  let input;
  try {
    input = JSON.parse(await readLimitedBody(request));
  } catch (error) {
    if (error instanceof DemoInputError) {
      return Response.json({ error: error.message }, { status: 413 });
    }
    return Response.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  try {
    const result = await orchestrateDemo(input);
    return Response.json(result, { status: result.status === 'completed' ? 200 : 502 });
  } catch (error) {
    if (error instanceof DemoInputError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    return Response.json({ error: 'Unable to run the ParkNow demo.' }, { status: 500 });
  }
}
