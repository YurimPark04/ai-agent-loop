# AI Agent Loop

로컬에서 실행하는 Qwen2.5 모델과 대화하는 TypeScript 프로젝트이다. `demo-agent`는 Ollama의 `/api/chat`에 한국어 질문과 계산 도구 스키마를 보내고, 모델이 요청한 계산을 실행한 뒤 결과를 다시 전달해 최종 답변을 터미널에 출력한다. 모델이 도구를 호출하지 않으면 받은 답변을 바로 출력한다.

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

   기본 질문은 `17 곱하기 23은?`이다. 질문을 바꾸려면 [`src/try.ts`](demo-agent/src/try.ts)의 `user` 메시지를 수정한다. 도구 호출 여부와 최종 답변 문구는 모델 응답에 따라 달라진다.

## 동작 흐름

1. 질문과 `calculate` 도구 스키마를 모델에 전달한다.
2. `tool_calls`가 없거나 빈 배열이면 모델의 응답 텍스트를 출력하고 종료한다.
3. 도구 호출이 있으면 각 호출을 순서대로 처리한다. `calculate`는 사칙연산과 괄호가 포함된 수식을 계산하며, 성공한 결과를 `계산 결과: 391`과 같은 형태로 출력한다.
4. 모델의 도구 호출 메시지와 각 실행 결과를 대화 기록에 보관한다. 지원하지 않는 도구, 잘못된 인자 타입, 계산 중 발생한 오류도 도구 결과로 전달한다.
5. 도구 스키마 없이 대화 기록을 모델에 다시 보내 최종 한국어 답변을 출력한다. 추가 도구 호출을 반복하는 루프는 실행하지 않는다.

도구가 정상 호출된 경우 출력은 다음과 비슷하다. 최종 답변 문구는 달라질 수 있다.

```text
계산 결과: 391
17 곱하기 23은 391입니다.
```

타입 검사는 `demo-agent` 디렉터리에서 `npx tsc --noEmit`으로 실행한다. `npm test`에는 아직 테스트가 등록되어 있지 않다.

## 프로젝트 구조

| 파일 | 역할 |
| --- | --- |
| [`demo-agent/src/try.ts`](demo-agent/src/try.ts) | 질문 전송, 도구 호출 처리, 실행 결과 전달과 최종 답변 출력을 담당하는 데모 진입점 |
| [`demo-agent/src/calc.ts`](demo-agent/src/calc.ts) | 사칙연산과 괄호를 처리하는 계산 도구 |
| [`demo-agent/src/ollama-chat.ts`](demo-agent/src/ollama-chat.ts) | Ollama에 요청을 보내고 `stream: false`로 받은 JSON 응답에서 메시지를 반환하는 클라이언트 |
| [`demo-agent/src/hello.ts`](demo-agent/src/hello.ts) | TypeScript 실행 환경을 확인하는 스크립트 |
| [`demo-agent/src/ex/tools.json`](demo-agent/src/ex/tools.json) | 산술 계산 도구의 입력 스키마 예시 |
| [`demo-agent/workspace/sample.md`](demo-agent/workspace/sample.md) | 에이전트 작업 공간의 예시 문서 |
