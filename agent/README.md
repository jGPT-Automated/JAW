# JAW voice agent

LiveKit Agents (Node.js) worker that gives JAW Hub a voice. The browser asks the hub for a token
(`POST /api/voice/token`); the hub creates a room and explicitly dispatches the agent named
**`jaw-voice`** with job metadata `{"conversation_id": "<uuid>"}`. This worker joins that room and
talks to the owner as "JAW", his voice assistant and chief of staff.

This directory is self-contained: its own `package.json`, `tsconfig.json`, `Dockerfile`, and
lockfile. It is based on the current
[`agent-starter-node`](https://github.com/livekit-examples/agent-starter-node) template.

## What it does

- Registers with `agentName: "jaw-voice"` (explicit dispatch only; it is never auto-dispatched).
- Runs a LiveKit Inference voice pipeline, so there are no per-provider API keys:

  | Stage          | Model identifier                                                         | Docs page                                                                                                                                   |
  | -------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
  | STT            | `deepgram/nova-3` (language `en`)                                        | [models/stt/deepgram](https://docs.livekit.io/agents/models/stt/deepgram.md)                                                                |
  | LLM            | `google/gemini-3.8-flash`                                                | [models/llm/gemini](https://docs.livekit.io/agents/models/llm/gemini.md)                                                                    |
  | TTS            | `cartesia/sonic-3`, voice `9626c31c-bec5-4cca-baa8-f8ba9e84c8bc`         | [models/tts](https://docs.livekit.io/agents/models/tts.md) and [models/tts/cartesia](https://docs.livekit.io/agents/models/tts/cartesia.md) |
  | Turn detection | `inference.TurnDetector()` audio turn detector (bundled Silero VAD)      | [logic/turns](https://docs.livekit.io/agents/logic/turns.md)                                                                                |
  | Noise handling | ai-coustics `QuailVfS` audio enhancement (what the current starter uses) | starter `src/main.ts`                                                                                                                       |

  Change models without editing code via `JAW_STT_MODEL`, `JAW_LLM_MODEL`, `JAW_TTS_MODEL`,
  `JAW_TTS_VOICE`. `deepgram/flux-general-en` is also offered by Inference if you want Deepgram's
  built-in end-of-turn detection (then set `turnDetection: 'stt'`).

- On session start it fetches `GET /api/agent/memory?limit=6`, adds those notes (compactly, marked
  as data, not instructions) to the system prompt, and greets briefly.
- Function tools, all calling the hub with `Authorization: Bearer $JAW_AGENT_TOKEN` and an 8 second
  timeout:

  | Tool          | Hub call                                                    |
  | ------------- | ----------------------------------------------------------- |
  | `remember`    | `POST /api/agent/memory` `{content, kind, conversation_id}` |
  | `recall`      | `GET /api/agent/memory?q=<query>&limit=6`                   |
  | `list_agents` | `GET /api/agent/me`                                         |
  | `delegate`    | `POST /api/agent/delegate` `{to, task, conversation_id}`    |

  Tools return short factual strings. On any failure they return a plain error such as
  `Error: the task was NOT delegated; the hub returned HTTP 404`, so the model reports it instead of
  inventing a result. A `rate_limited` delegate status is reported as "queued for later, has not run".

- Mirrors the transcript: every committed user and assistant message is posted to
  `POST /api/agent/transcript` `{conversation_id, role, text}`, fire-and-forget, in order, with
  failures logged. The queue is flushed in the job shutdown callback.

## Environment variables

| Variable             | Required | Notes                                                  |
| -------------------- | -------- | ------------------------------------------------------ |
| `LIVEKIT_URL`        | yes      | `wss://<project>.livekit.cloud`                        |
| `LIVEKIT_API_KEY`    | yes      | LiveKit Cloud project key                              |
| `LIVEKIT_API_SECRET` | yes      | LiveKit Cloud project secret                           |
| `JAW_API_URL`        | yes      | Hub base URL, for example `https://jaw.vercel.app`     |
| `JAW_AGENT_TOKEN`    | yes      | Bearer token the hub accepts on `/api/agent/*`         |
| `JAW_STT_MODEL` etc. | no       | Optional Inference model overrides, see `.env.example` |

The process validates these at startup and exits with a list of every missing or invalid value.
Copy `.env.example` to `.env.local` and fill it in. Never commit real values.

## Local development

Requires Node 22.18 or newer (Node 24 in the Docker image) and pnpm 10.

```bash
cd agent
pnpm install
cp .env.example .env.local   # fill in real values
pnpm dev                     # node src/main.ts dev: registers "jaw-voice" with your LiveKit project
```

`lk agent dev` is the CLI's recommended equivalent if you have the `lk` CLI installed (the SDK's
own `dev` subcommand is marked deprecated in favor of it). With the worker running, open the hub's
voice page; the token endpoint dispatches `jaw-voice` into the room and your local worker picks it
up. Only one environment should be registered for `jaw-voice` at a time while you test, otherwise
LiveKit may dispatch to the deployed copy.

Checks:

```bash
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test      # vitest; the hub HTTP layer is tested with fetch mocked
```

## Deploy to LiveKit Cloud

These commands change production state and need the owner's LiveKit login, so the owner runs them.
Check `lk agent --help` for the flags of your installed CLI version.

1. Install and authenticate the `lk` CLI, and link the project: `lk cloud auth` (or
   `lk project add`).
2. Put the two hub values (`JAW_API_URL`, `JAW_AGENT_TOKEN`) in a secrets file, for example
   `.env.production` (git-ignored). The CLI copies every value in the file except LiveKit Cloud
   credentials, which LiveKit injects itself.
3. From this directory create the agent. This builds the `Dockerfile` and writes `livekit.toml`
   (commit it; it holds no secrets):

   ```bash
   cd agent
   lk agent create --secrets-file=.env.production
   ```

   Confirm the agent name is `jaw-voice` (it is set in code by `agentName`).

4. To change secrets later (this triggers a rolling restart):

   ```bash
   lk agent update-secrets --secrets "JAW_AGENT_TOKEN=new-value"
   lk agent secrets            # lists names only
   ```

   Ship code changes with `lk agent deploy`. Useful follow-ups:

   ```bash
   lk agent status
   lk agent logs               # runtime logs; add --log-type=build for build logs
   lk agent rollback           # previous version, no rebuild (paid plans only)
   ```

5. Verify with a real conversation from the hub voice page. Agent sessions, transcripts and
   traces are in the LiveKit Cloud dashboard under Agents.

Operational notes:

- On the free Build plan an idle production agent scales to zero and the first session after
  that cold-starts (10 to 20 seconds before JAW joins). Paid plans stay warm.
- Production mode drains on `SIGTERM`: it stops taking new jobs and lets active calls finish.
- The image runs `livekit-agents download-files` at build time (a no-op today; it only matters if
  you add plugins that ship local models) and runs as a non-root user.
- Pin SDK upgrades: read the `@livekit/agents` changelog, upgrade on a branch, run `pnpm test`, and
  have a real conversation before deploying.

## Layout

```
src/main.ts        worker entry, session pipeline, transcript mirroring
src/agent.ts       persona/instructions and the four function tools
src/hub.ts         hub HTTP client (timeouts, error strings, formatting)
src/config.ts      env validation, model defaults, dispatch metadata parsing
src/*.test.ts      vitest unit tests (fetch mocked)
```
