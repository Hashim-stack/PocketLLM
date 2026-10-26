# Contributing to PocketLLM
Thanks for helping out! This project is intentionally small and dependency-free.

## Setup
```bash
git clone https://github.com/Hashim-stack/PocketLLM
cd pocketllm
then open http://localhost:8000 in Chrome or Edge
```

## Guidelines
- Keep it html,js(Vanila): no framework or build step unless discussed first.
- Keep the module split: DOM code in `chat-ui.js`, data in `chat-state.js`, WebLLM code in `model-service.js`, glue in `app.js`.
- Never insert model output with `innerHTML`; use `textContent` (or a sanitizer if you add markdown).
- Don't add features that persist or send chat text anywhere without making them opt-in and documenting them in the README privacy section.
- Test the acceptance checklist in the README before opening a PR.

## Commit style
Use short, conventional messages such as `feat: ...`, `fix: ...`, `docs: ...`, `style: ...`, `ci: ...`.

## Reporting bugs
Include your browser and version, OS, GPU, the model ID, and any console errors.
