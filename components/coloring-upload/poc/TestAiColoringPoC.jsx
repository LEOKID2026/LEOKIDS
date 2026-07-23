import { useCallback, useEffect, useRef, useState } from "react";
import {
  AI_LINE_ART_MODELS,
  DEFAULT_AI_LINE_ART_MODEL_KEY,
  disposeAiLineArtPoC,
  runAiLineArtPoC,
} from "../../../lib/coloring-upload/poc/ai-line-art.client.js";
import { runColoringPipeline } from "../../../lib/coloring-upload/pipeline-client.client.js";

function drawImageData(canvas, imageData) {
  if (!canvas || !imageData) return;
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  canvas.getContext("2d")?.putImageData(imageData, 0, 0);
}

async function fileToImageData(file, maxEdge = 1280) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Canvas unavailable");
  }
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return ctx.getImageData(0, 0, w, h);
}

/**
 * Temporary PoC — compare Transformers.js AI line art vs production OpenCV pipeline.
 */
export default function TestAiColoringPoC() {
  const sourceCanvasRef = useRef(null);
  const aiCanvasRef = useRef(null);
  const depthCanvasRef = useRef(null);
  const opencvCanvasRef = useRef(null);

  const [modelKey, setModelKey] = useState(DEFAULT_AI_LINE_ART_MODEL_KEY);
  const [device, setDevice] = useState("webgpu");
  const [edgeThreshold, setEdgeThreshold] = useState(20);
  const [useSegmentation, setUseSegmentation] = useState(true);
  const [opencvPreset, setOpencvPreset] = useState("balanced");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [sourceData, setSourceData] = useState(null);
  const [lastAiModel, setLastAiModel] = useState("");

  useEffect(() => () => disposeAiLineArtPoC(), []);

  const onFile = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    setStatus("Loading image…");
    try {
      const imageData = await fileToImageData(file);
      setSourceData(imageData);
      drawImageData(sourceCanvasRef.current, imageData);
      setStatus("Image ready — run AI and/or OpenCV.");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus("");
    }
  }, []);

  const runAi = useCallback(async () => {
    if (!sourceData) return;
    setBusy(true);
    setError("");
    try {
      setStatus("Starting AI pipeline…");
      const blob = await new Promise((resolve, reject) => {
        const c = document.createElement("canvas");
        c.width = sourceData.width;
        c.height = sourceData.height;
        c.getContext("2d")?.putImageData(sourceData, 0, 0);
        c.toBlob((b) => (b ? resolve(b) : reject(new Error("Blob encode failed"))), "image/png");
      });
      const result = await runAiLineArtPoC(blob, {
        modelKey,
        device,
        edgeThreshold,
        onProgress: (phase, detail) => {
          if (phase === "model-download" && typeof detail === "number") {
            setStatus(`Downloading model… ${detail}%`);
          } else {
            setStatus(typeof detail === "string" ? detail : `AI: ${phase}`);
          }
        },
      });
      drawImageData(aiCanvasRef.current, result.lineArt);
      if (result.depthPreview) drawImageData(depthCanvasRef.current, result.depthPreview);
      setLastAiModel(result.modelId);
      setStatus(`AI done (${result.modelId})`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus("");
    } finally {
      setBusy(false);
    }
  }, [sourceData, modelKey, device, edgeThreshold]);

  const runOpenCv = useCallback(async () => {
    if (!sourceData) return;
    setBusy(true);
    setError("");
    try {
      setStatus("Running OpenCV pipeline…");
      const result = await runColoringPipeline(sourceData, opencvPreset, {
        skipSegmentation: !useSegmentation,
        onProgress: (pct, phase) => setStatus(`OpenCV ${phase} — ${pct}%`),
      });
      drawImageData(opencvCanvasRef.current, result.lineArt);
      setStatus("OpenCV done.");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus("");
    } finally {
      setBusy(false);
    }
  }, [sourceData, opencvPreset, useSegmentation]);

  const runBoth = useCallback(async () => {
    await runAi();
    await runOpenCv();
  }, [runAi, runOpenCv]);

  return (
    <div className="ai-coloring-poc" dir="ltr">
      <header className="ai-coloring-poc-header">
        <h1>AI Line-Art PoC (Transformers.js)</h1>
        <p>
          Temporary test page — does not affect the production coloring upload wizard. First AI run
          downloads ~25MB model weights from Hugging Face (cached afterward).
        </p>
        <p className="ai-coloring-poc-note">
          <strong>Note:</strong> <code>Xenova/hed</code> is not available for Transformers.js. This
          PoC uses <code>onnx-community/depth-anything-v2-small</code> (AI depth → structural edge
          lines) as the closest free in-browser vision model.
        </p>
      </header>

      <section className="ai-coloring-poc-controls">
        <label className="ai-coloring-poc-field">
          Upload photo (e.g. Playing_with_children.jpeg)
          <input type="file" accept="image/*" onChange={onFile} disabled={busy} />
        </label>

        <label className="ai-coloring-poc-field">
          AI model
          <select value={modelKey} onChange={(e) => setModelKey(e.target.value)} disabled={busy}>
            {Object.entries(AI_LINE_ART_MODELS).map(([key, m]) => (
              <option key={key} value={key}>
                {m.label} (~{m.approxMb}MB)
              </option>
            ))}
          </select>
        </label>

        <label className="ai-coloring-poc-field">
          Device
          <select value={device} onChange={(e) => setDevice(e.target.value)} disabled={busy}>
            <option value="webgpu">WebGPU (fallback WASM)</option>
            <option value="wasm">WASM only</option>
          </select>
        </label>

        <label className="ai-coloring-poc-field">
          Depth edge threshold ({edgeThreshold})
          <input
            type="range"
            min={8}
            max={48}
            value={edgeThreshold}
            onChange={(e) => setEdgeThreshold(Number(e.target.value))}
            disabled={busy}
          />
        </label>

        <label className="ai-coloring-poc-field">
          OpenCV preset
          <select
            value={opencvPreset}
            onChange={(e) => setOpencvPreset(e.target.value)}
            disabled={busy}
          >
            <option value="simple">simple</option>
            <option value="balanced">balanced</option>
            <option value="detailed">detailed</option>
          </select>
        </label>

        <label className="ai-coloring-poc-check">
          <input
            type="checkbox"
            checked={useSegmentation}
            onChange={(e) => setUseSegmentation(e.target.checked)}
            disabled={busy}
          />
          OpenCV: subject segmentation (imgly)
        </label>

        <div className="ai-coloring-poc-actions">
          <button type="button" onClick={runAi} disabled={busy || !sourceData}>
            Run AI
          </button>
          <button type="button" onClick={runOpenCv} disabled={busy || !sourceData}>
            Run OpenCV
          </button>
          <button type="button" onClick={runBoth} disabled={busy || !sourceData}>
            Run both
          </button>
        </div>
      </section>

      {status ? (
        <p className="ai-coloring-poc-status" role="status">
          {status}
          {lastAiModel ? ` · Model: ${lastAiModel}` : ""}
        </p>
      ) : null}
      {error ? (
        <p className="ai-coloring-poc-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="ai-coloring-poc-grid">
        <figure>
          <figcaption>Source</figcaption>
          <canvas ref={sourceCanvasRef} className="ai-coloring-poc-canvas" />
        </figure>
        <figure>
          <figcaption>AI line art (Transformers.js)</figcaption>
          <canvas ref={aiCanvasRef} className="ai-coloring-poc-canvas" />
        </figure>
        <figure>
          <figcaption>AI depth preview</figcaption>
          <canvas ref={depthCanvasRef} className="ai-coloring-poc-canvas" />
        </figure>
        <figure>
          <figcaption>OpenCV pipeline (production)</figcaption>
          <canvas ref={opencvCanvasRef} className="ai-coloring-poc-canvas" />
        </figure>
      </div>

      <style jsx>{`
        .ai-coloring-poc {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem;
          font-family: system-ui, sans-serif;
          color: #1a1a1a;
        }
        .ai-coloring-poc-header h1 {
          margin: 0 0 0.5rem;
          font-size: 1.5rem;
        }
        .ai-coloring-poc-header p {
          margin: 0.35rem 0;
          line-height: 1.45;
          color: #444;
        }
        .ai-coloring-poc-note {
          padding: 0.75rem 1rem;
          background: #fff8e6;
          border: 1px solid #f0d080;
          border-radius: 8px;
        }
        .ai-coloring-poc-controls {
          display: grid;
          gap: 0.75rem;
          margin: 1.25rem 0;
          padding: 1rem;
          background: #f7f7f7;
          border-radius: 10px;
        }
        .ai-coloring-poc-field {
          display: grid;
          gap: 0.35rem;
          font-size: 0.9rem;
        }
        .ai-coloring-poc-check {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }
        .ai-coloring-poc-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .ai-coloring-poc-actions button {
          padding: 0.55rem 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          background: #fff;
          cursor: pointer;
        }
        .ai-coloring-poc-actions button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .ai-coloring-poc-status {
          color: #2563eb;
          font-size: 0.9rem;
        }
        .ai-coloring-poc-error {
          color: #b91c1c;
          font-size: 0.9rem;
        }
        .ai-coloring-poc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1rem;
        }
        figure {
          margin: 0;
        }
        figcaption {
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 0.35rem;
        }
        .ai-coloring-poc-canvas {
          width: 100%;
          height: auto;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}
