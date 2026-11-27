const OLLAMA_URL = "http://localhost:11434";
export const MODEL = "qwen2.5";

// // custom type ChatMessage 명시 > 응답 고정
// export type ChatMessage = {
//   role: "system" | "user" | "assistant";
//   content: string;
// };

// export async function chat(messages: ChatMessage[]): Promise<ChatMessage> {
//   const response = await fetch(`${OLLAMA_URL}/api/chat`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       model: MODEL,
//       messages,
//       stream: false,
//       options: { temperature: 0 },
//     }),
//   });
//   if (!response.ok) throw new Error(`Ollama 요청 실패: ${response.status}`);
//   const data = (await response.json()) as { message: ChatMessage }; // 응답 자체를 ChatMessage 로 고정 (타입 단언; 외부 사용 시, 데이터의 메시지값이 어떤 타입인지 알 수 있음)
//   return data.message;
// }

// 모델에 tool 등록 - 응답에 담겨올 도구 호출에 대한 스키마
export type ToolCall = {
  function: { name: string; arguments: Record<string, unknown> };
};

// 우리가 사용할 tool 에 대한 모양
export type ToolSchema = {
  type: "function";
  function: { name: string; description: string; parameters: object };
};

// tool_calls, tool_name 이 추가되어야 한다
// role 도 tool 이 추가되어야 함
export type ChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_calls?: ToolCall[]; // 추가
  tool_name?: string; // 추가
};

// 메시지 + tool도 받아줘야 함
export async function chat(
  messages: ChatMessage[],
  tools?: ToolSchema[]
): Promise<ChatMessage> {
  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages,
      tools, //tools 추가
      stream: false,
      options: { temperature: 0 },
    }),
  });

  if (!response.ok) throw new Error(`Ollama 요청 실패: ${response.status}`);
  const data = (await response.json()) as { message: ChatMessage };
  return data.message;
}
