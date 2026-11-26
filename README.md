# AI Agent Loop

로컬에서 실행하는 Qwen2.5 모델과 대화하는 TypeScript 프로젝트이다. `demo-agent`는 Ollama의 `/api/chat`에 한국어 프롬프트를 보내고, 완성된 응답을 터미널에 출력한다.

## 실행 방법

Node.js와 npm, Ollama가 필요하다. [Ollama 설치](https://ollama.com/download)

1. Ollama가 `http://localhost:11434`에서 실행 중인지 확인한다. 서버가 실행 중이 아니면 별도 터미널에서 `ollama serve`를 실행한다.

2. Qwen2.5 모델을 내려받는다.

   ```sh
   ollama pull qwen2.5
   ```

3. 저장소 루트에서 `demo-agent`로 이동해 의존성을 설치하고 데모를 실행한다.

   ```sh
   cd demo-agent
   npm ci
   npx tsx src/try.ts
   ```

   데모는 모델에게 한국어로 자기소개를 요청하고 응답 텍스트를 출력한다. 질문을 바꾸려면 [`src/try.ts`](demo-agent/src/try.ts)의 `user` 메시지를 수정한다.

## 프로젝트 구조

| 파일 | 역할 |
| --- | --- |
| [`demo-agent/src/try.ts`](demo-agent/src/try.ts) | 시스템 지시와 사용자 메시지를 구성하는 데모 진입점 |
| [`demo-agent/src/ollama-chat.ts`](demo-agent/src/ollama-chat.ts) | Ollama에 요청을 보내고 `stream: false`로 받은 JSON 응답에서 메시지를 반환하는 클라이언트 |
| [`demo-agent/src/hello.ts`](demo-agent/src/hello.ts) | TypeScript 실행 환경을 확인하는 스크립트 |
| [`demo-agent/src/ex/tools.json`](demo-agent/src/ex/tools.json) | 산술 계산 도구의 입력 스키마 예시 |
| [`demo-agent/workspace/sample.md`](demo-agent/workspace/sample.md) | 에이전트 작업 공간의 예시 문서 |
