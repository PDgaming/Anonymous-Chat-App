import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

const messagesPath = path.join(process.cwd(), 'src', 'messages.json');

export async function GET() {
  try {
    const data = await fs.readFile(messagesPath, 'utf-8');
    return json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading messages:', error);
    return json({ messages: [] });
  }
}

export async function POST({ request }) {
  try {
    const newMessage = await request.json();
    const data = await fs.readFile(messagesPath, 'utf-8');
    const { messages } = JSON.parse(data);
    messages.push(newMessage);
    await fs.writeFile(messagesPath, JSON.stringify({ messages }, null, 2));
    return json({ success: true });
  } catch (error) {
    console.error('Error writing message:', error);
    return json({ success: false }, { status: 500 });
  }
}