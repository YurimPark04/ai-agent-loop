// const response = await fetch("http://localhost:11434/api/chat", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//         model: "qwen2.5",
//         messages: [{ role: "user", content: "한 문장으로 자기소개 해줘" }],
//         stream: false,   // 단위별로 스트리밍
//         // 값이 높으면 창의성, 다양성이 보장됨 -> 0이면 안정성
//         options: { temperature: 0 },
//     }),
// });

// // system : 모델에거 주는 전반적인 지시
// // user : 사용자의 말
// // assistant : 모델이 한 말
// const data = await response.json();
// console.log(data.message.content);

// import { chat, type ChatMessage } from "./ollama-chat"

// const messages: ChatMessage[] = [
//     { role: "system", content: "당신은 한국어로 답하는 도우미입니다." },
//     { role: "user", content: "한 문장으로 자기소개 해줘" },
// ];

// const reply = await chat(messages);
// console.log(reply.content);

// tool calling
import { calculate } from "./calc";
import { chat, type ChatMessage, type ToolSchema } from "./ollama-chat";

//테스트
//console.log(calculate("17*23"), calculate("(2+3)*4-1"));

//toolschema 정의 : 모델에게 건넬 도구를 정의
const calculateSchema: ToolSchema = {
  type: "function",
  function: {
    name: "calculate",
    description: "산술 수식을 계산합니다. 예: '17*23'",
    parameters: {
      type: "object",
      properties: {
        expression: { type: "string", description: "계산할 수식" },
      },
      required: ["expression"],
    },
  },
};

const messages: ChatMessage[] = [
  {
    role: "system",
    content: "당신은 한국어 도우미입니다. 계산이 필요하면 calculate 도구를 사용하고, 도구 결과를 바탕으로 최종 답변을 작성하세요. 도구 실행에 실패하면 오류를 설명하세요.",
  },
  { role: "user", content: "17 곱하기 23은?" },
];

const reply = await chat(messages, [calculateSchema]);

messages.push(reply);

const calls = reply.tool_calls ?? [];

if (calls.length === 0) {
  console.log(reply.content);
} else {
  for (const call of calls) {
    let result: string;
    try {
      if (call.function.name !== "calculate") {
        throw new Error(`지원하지 않는 도구: ${call.function.name}`);
      }
      const expression = call.function.arguments.expression;
      if (typeof expression !== "string") {
        throw new Error("expression은 문자열이어야 합니다");
      }
      result = String(calculate(expression));
      console.log("계산 결과:", result);
    } catch (error) {
      result = `도구 실행 오류: ${error instanceof Error ? error.message : String(error)}`;
      console.error(result);
    }

    messages.push({ role: "tool", content: result, tool_name: call.function.name });
  }

  // 도구 결과까지 포함한 대화로 최종 답변을 요청한다.
  const finalReply = await chat(messages);
  console.log(finalReply.content);
}
