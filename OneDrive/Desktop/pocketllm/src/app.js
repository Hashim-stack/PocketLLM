// Chat controller: wires UI, state and model together.
import { ui } from "./chat-ui.js";
import { ChatState } from "./chat-state.js";
import { ModelService, MODEL_ID } from "./model-service.js";

const state = new ChatState();
const model = new ModelService();
let generating = false;

async function initModel() {
  ui.hideError();
  ui.setBusy({ canType: false });
  ui.setStatus("Loading model…", "busy");
  ui.showProgress(0, `Preparing ${MODEL_ID} (first run downloads the model; later runs use the cache)`);
  try {
    await model.init((p, text) => ui.showProgress(p, text));
    ui.hideProgress();
    ui.setStatus("Ready", "ready");
    ui.setBusy({ canType: true });
  } catch (err) {
    console.error(err);
    ui.hideProgress();
    ui.setStatus("Error");
    ui.showError(`Couldn't start the model: ${err.message}`, { retry: true });
  }
}

async function sendPrompt() {
  const text = ui.els.prompt.value.trim();
  if (!text || generating || !model.ready) return; // reject empty / duplicate submits

  generating = true;
  ui.hideError();
  ui.els.prompt.value = "";
  state.add("user", text);
  ui.addMessage("user", text);

  const reply = state.add("assistant", "");
  const bubble = ui.addMessage("assistant", "");
  bubble.classList.add("pending");
  ui.setStatus("Generating…", "busy");
  ui.setBusy({ canType: false, generating: true });

  try {
    for await (const piece of model.generate(state.context())) {
      reply.content += piece;
      ui.updateMessage(bubble, reply.content);
    }
    if (!reply.content) ui.updateMessage(bubble, "(No response generated.)");
  } catch (err) {
    console.error(err);
    ui.showError(`Generation failed: ${err.message}. You can try sending again.`);
    if (!reply.content) bubble.remove();
  } finally {
    bubble.classList.remove("pending");
    generating = false;
    ui.setStatus("Ready", "ready");
    ui.setBusy({ canType: true });
  }
}

ui.els.form.addEventListener("submit", e => { e.preventDefault(); sendPrompt(); });
ui.els.prompt.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendPrompt(); }
});
ui.els.stop.addEventListener("click", () => model.stop());
ui.els.retry.addEventListener("click", initModel);
ui.els.clear.addEventListener("click", () => {
  if (generating) model.stop();
  state.clear();
  ui.clearMessages();
});

initModel();
