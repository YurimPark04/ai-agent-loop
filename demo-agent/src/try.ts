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

import { chat, type ChatMessage } from "./ollama-chat"


const messages: ChatMessage[] = [
    { role: "system", content: "당신은 한국어로 답하는 도우미입니다." },
    { role: "user", content: "한 문장으로 자기소개 해줘" },
];

const reply = await chat(messages);
console.log(reply.content);