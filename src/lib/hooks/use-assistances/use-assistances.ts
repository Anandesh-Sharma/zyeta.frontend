import { useCallback } from "react";
import { useLLMAtom } from "../use-llm";

export const useAssistants = () => {
    const llmModels = useLLMAtom('LLMModels', 'get');
    
    const getAssistants = useCallback(() => [...llmModels], [llmModels]);   
    return {
        getAssistants
    };
};