// Holds conversation data only. No DOM, no model code.
const SYSTEM_PROMPT = "You are a helpful, concise assistant running locally in the user's browser.";
const MAX_CONTEXT_MESSAGES = 12; // keeps prompts small for small models

export class ChatState {
  #messages = [];

  get messages() { return this.#messages; }

  add(role, content) {
    const msg = { role, content };
    this.#messages.push(msg);
    return msg;
  }

  /** Messages sent to the model: system prompt + most recent turns. */
  context() {
    const recent = this.#messages.filter(m => m.content).slice(-MAX_CONTEXT_MESSAGES);
    return [{ role: "system", content: SYSTEM_PROMPT }, ...recent];
  }

  clear() { this.#messages = []; }
}
