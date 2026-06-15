import { useState } from "react";
import Markdown from "react-markdown";
import axios from "axios";
import "./App.css";

function App() {
  const [code, setCode] = useState(`function sum() {\n  return 1 + 1\n}`);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  async function reviewCode() {
    if (loading) return;
    setLoading(true);
    setReview("");
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", {
        code,
      });
      setReview(response.data);
    } catch (error) {
      console.error("Error reviewing code:", error);
      setReview("**Error:** Failed to review code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const statusColor = loading ? "#f59e0b" : review ? "#10b981" : "#d1d5db";

  return (
    <main>
      {/* Left Panel - Editor */}
      <div className="left">
        <div className="editor-header">
          <div className="dot dot-r" />
          <div className="dot dot-y" />
          <div className="dot dot-g" />
          <span className="editor-title">Code Editor</span>
          <span className="lang-badge">JavaScript</span>
        </div>

        <div className="code">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here…"
            spellCheck={false}
          />
        </div>

        <div className="bottom-bar">
          <span className="hint">
            Paste code · <span>Click Review</span>
          </span>
          <button
            className="review-btn"
            onClick={reviewCode}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinning">⟳</span>
                Reviewing…
              </>
            ) : (
              <>✦ Review Code</>
            )}
          </button>
        </div>
      </div>

      {/* Right Panel - Output */}
      <div className="right">
        <div className="right-header">
          <span style={{ fontSize: 16, color: "#9ca3af" }}>◈</span>
          <span className="right-header-title">Review Output</span>
          <div className="status-dot" style={{ background: statusColor }} />
        </div>

        <div className="right-content">
          {review ? (
            <div>
              <Markdown>{review}</Markdown>
            </div>
          ) : (
            <div className="placeholder-state">
              <span className="icon">⌥</span>
              <p>
                Your code review will appear here after clicking Review Code.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
