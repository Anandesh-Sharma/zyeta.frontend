import { useRecoilCallback, useRecoilValue } from 'recoil';
import { chatAtomFamily, chatIdsState, currentChatIdState } from '../store/chat/atoms';
import { currentChatState } from '../store/chat/selectors';
import { Conversation } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { llmModelsState } from '../store/assistants/atoms';
import { useLLM } from './use-llm';
import { DEFAULT_ASSISTANT } from '../constants/chat';

export function useChat() {
  const chatIds = useRecoilValue(chatIdsState);
  const currentChat = useRecoilValue(currentChatState);
  const models = useRecoilValue(llmModelsState);
  const { fetchModels } = useLLM();

  const setCurrentChatId = useRecoilCallback(({ set }) => (chatId: string) => {
    set(currentChatIdState, chatId);
  }, []);

  const createNewChat = useRecoilCallback(({ set }) => async (assistantId?: string) => {
    const newId = uuidv4();
    
    // If no models are loaded, fetch them first
    let availableModels = models;
    if (availableModels.length === 0) {
      try {
        availableModels = await fetchModels();
      } catch (err) {
        console.error('Failed to fetch models:', err);
        // Use default assistant as fallback
        availableModels = [{ id: DEFAULT_ASSISTANT.id }];
      }
    }

    // Use the provided assistant ID or the first available model
    const defaultModel = assistantId || availableModels[0]?.id || DEFAULT_ASSISTANT.id;

    const newChat: Conversation = {
      id: newId,
      title: 'New Chat',
      messages: [],
      model: defaultModel,
      timestamp: Date.now(),
    };

    set(chatAtomFamily(newId), newChat);
    set(chatIdsState, (prev) => [newId, ...prev]);
    set(currentChatIdState, newId);
    return newChat;
  }, [models, fetchModels]);

  const updateChat = useRecoilCallback(({ set }) => (chatId: string, updates: Partial<Conversation>) => {
    set(chatAtomFamily(chatId), (prevChat) => ({ ...prevChat, ...updates }));
  }, []);

  const deleteChat = useRecoilCallback(({ set, snapshot }) => async (chatId: string) => {
    const currentIds = await snapshot.getPromise(chatIdsState);
    
    if (currentIds.length <= 1) return;

    const newIds = currentIds.filter(id => id !== chatId);
    set(chatIdsState, newIds);
    
    const currentId = await snapshot.getPromise(currentChatIdState);
    if (currentId === chatId) {
      const currentIndex = currentIds.indexOf(chatId);
      const nextId = currentIds[currentIndex + 1] || currentIds[currentIndex - 1];
      set(currentChatIdState, nextId);
    }
  }, []);

  return {
    chatIds,
    currentChat,
    createNewChat,
    updateChat,
    deleteChat,
    setCurrentChatId,
  };
}