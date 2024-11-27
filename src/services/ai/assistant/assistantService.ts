import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { validateEnv } from '../../../config/env';
import { logger } from '../../../server/config/logger';

let openaiModel: ChatOpenAI | null = null;

export async function initializeAssistant(role: 'teacher' | 'parent') {
  try {
    const env = validateEnv();
    openaiModel = new ChatOpenAI({
      openAIApiKey: env.VITE_OPENAI_API_KEY,
      modelName: 'gpt-4-turbo-preview',
      temperature: 0.7
    });

    logger.info('AI Assistant initialized successfully');
  } catch (error) {
    logger.error('AI Assistant initialization error:', error);
    throw new Error('Failed to initialize AI Assistant');
  }
}

export async function getAssistantResponse(message: string): Promise<string> {
  if (!openaiModel) {
    await initializeAssistant('teacher'); // Default to teacher role if not initialized
  }

  try {
    const template = PromptTemplate.fromTemplate(getAssistantTemplate('teacher'));
    const prompt = await template.format({ input: message });
    
    const response = await openaiModel!.invoke(prompt);
    return response.content;
  } catch (error) {
    logger.error('AI Assistant response error:', error);
    throw new Error('Failed to get AI Assistant response');
  }
}

function getAssistantTemplate(role: 'teacher' | 'parent'): string {
  if (role === 'teacher') {
    return `You are a helpful teaching assistant for Kokoro Quest, specializing in:
      - Social-emotional learning (SEL)
      - Student progress monitoring
      - Activity recommendations
      - Best practices for emotional intelligence development
      
      Human: {input}
      Assistant:`;
  }

  return `You are a supportive parenting advisor for Kokoro Quest, specializing in:
    - Child emotional development
    - Parent-child communication
    - Activity suggestions
    - Progress interpretation
    
    Human: {input}
    Assistant:`;
}