'use server'

import { getChatResponse } from '@/src/lib/ai'

export async function chatAction(
  prompt: string, 
  history: { role: 'user' | 'assistant', content: string }[],
  userName?: string
) {
  try {
    const text = await getChatResponse(prompt, history, userName);
    return { success: true, text };
  } catch (error: any) {
    console.error("AI Error:", error);
    return { 
      success: false, 
      error: error.message || "AI failed to respond. Please try again." 
    };
  }
}
