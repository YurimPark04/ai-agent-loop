const OLLAMA_URL = "http://localhost:11434";
export const MODEL = "qwen2.5";


// custom type ChatMessage 명시 > 응답 자체를 
export type ChatMessage = {
    role: "system" | "user" | "assistant";
    content: string;
};

export async function chat(messages: ChatMessage[]): Promise<ChatMessage> {
    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: MODEL,
            messages,
            stream: false,
            options: { temperature: 0 }
        }),
    });
    if (!response.ok) throw new Error(`Ollama 요청 실패: ${response.status}`);
    const data = (await response.json()) as { message: ChatMessage };   // 응답 자체를 ChatMessage 로 고정 (타입 단언; 외부 사용 시, 데이터의 메시지값이 어떤 타입인지 알 수 있음)
    return data.message;
}