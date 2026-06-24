import Groq from "groq-sdk";

const SYSTEM_PROMPT = `You are SYNTH, a professional AI coding partner built for developers. You specialize in software development, debugging, refactoring, and system architecture.

Rules:
- Provide concise, high-quality code examples and technical explanations.
- Always wrap code in markdown code blocks with the appropriate language specified (e.g. \`\`\`python, \`\`\`typescript).
- Be direct and professional. Avoid unnecessary filler.
- When debugging, explain the root cause before showing the fix.
- When asked to build something, provide complete, production-ready code.`;

export async function getChatResponse(
  prompt: string, 
  history: { role: 'user' | 'assistant', content: string }[],
  userName: string = 'Developer'
) {
  const apiKey = process.env.GROQ_API_KEY;
  
  const dynamicSystemPrompt = `You are SYNTH, a professional AI coding partner. You are currently assisting ${userName}, who is the lead developer of this project.

Rules:
- Recognition: Always treat ${userName} with professional respect as the lead developer.
- Context: You specialize in full-stack development, specifically Next.js, Supabase, and Tailwind CSS.
- Code Quality: Provide production-grade, concise code examples.
- Formatting: Always use markdown for code blocks.`;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not defined.");
  }

  const groq = new Groq({ apiKey });

  const messages: { role: 'system' | 'user' | 'assistant', content: string }[] = [
    { role: 'system', content: dynamicSystemPrompt },
    ...history.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
    { role: 'user', content: prompt },
  ];

  const chatCompletion = await groq.chat.completions.create({
    messages,
    model: "llama-3.3-70b-versatile",
    temperature: 0.6,
    max_completion_tokens: 4096,
  });

  return chatCompletion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";
}
