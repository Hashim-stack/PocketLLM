// All WebLLM-specific logic lives here.
// Pinned version; check https://webllm.mlc.ai/ for current releases.
import * as webllm from "https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.79/+esm";

// Small model for low-memory devices. Verify it's in WebLLM's current list,
// and check its license/model card before use.
export const MODEL_ID = "Llama-3.2-1B-Instruct-q4f16_1-MLC";

export class ModelService {
  #engine = null;

  static isSupported() { return "gpu" in navigator; }

  async init(onProgress) {
    if (!ModelService.isSupported()) {
      throw new Error("WebGPU isn't available in this browser. Try a recent desktop Chrome or Edge.");
    }
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) throw new Error("No compatible GPU adapter found. Your device may not support WebGPU.");

    const known = webllm.prebuiltAppConfig.model_list.some(m => m.model_id === MODEL_ID);
    if (!known) throw new Error(`Model "${MODEL_ID}" is not in WebLLM's supported list. Update MODEL_ID in model-service.js.`);

    this.#engine = await webllm.CreateMLCEngine(MODEL_ID, {
      initProgressCallback: p => onProgress?.(p.progress ?? 0, p.text ?? ""),
    });
  }

  get ready() { return this.#engine !== null; }

  /** Streams text chunks. Call stop() to interrupt. */
  async *generate(messages) {
    const stream = await this.#engine.chat.completions.create({ messages, stream: true, temperature: 0.7 });
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) yield delta;
    }
  }

  stop() { this.#engine?.interruptGenerate(); }
}
