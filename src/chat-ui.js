// DOM rendering only.
const $ = id => document.getElementById(id);

export const ui = {
  els: {
    form: $("chat-form"), prompt: $("prompt"), send: $("send-btn"), stop: $("stop-btn"),
    clear: $("clear-btn"), retry: $("retry-btn"),
  },

  setStatus(text, kind = "") {
    const s = $("status");
    s.textContent = text;
    s.className = `status ${kind}`;
  },

  showProgress(fraction, text) {
    $("progress-wrap").hidden = false;
    $("progress-bar").style.width = `${Math.round(fraction * 100)}%`;
    $("progress-text").textContent = text;
  },
  hideProgress() { $("progress-wrap").hidden = true; },

  showError(message, { retry = false } = {}) {
    $("error-text").textContent = message;
    $("retry-btn").hidden = !retry;
    $("error").hidden = false;
  },
  hideError() { $("error").hidden = true; },

  /** Enable/disable inputs. `generating` also shows the Stop button. */
  setBusy({ canType, generating = false }) {
    this.els.prompt.disabled = !canType;
    this.els.send.disabled = !canType;
    this.els.send.hidden = generating;
    this.els.stop.hidden = !generating;
    if (canType) this.els.prompt.focus();
  },

  addMessage(role, text = "") {
    const box = $("messages");
    box.querySelector(".empty")?.remove();
    const div = document.createElement("div");
    div.className = `msg ${role}`;
    div.textContent = text; // textContent: never inject model output as HTML
    box.append(div);
    box.scrollTop = box.scrollHeight;
    return div;
  },

  updateMessage(div, text) {
    div.textContent = text;
    const box = $("messages");
    box.scrollTop = box.scrollHeight;
  },

  clearMessages() {
    $("messages").innerHTML = '<p class="empty">Chat cleared. Ask something new.</p>';
  },
};
