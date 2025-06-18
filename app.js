const defaultMarkdown = `# Markdown Previewer ✨

## Features
- Live preview
- Download as Markdown or HTML
- Upload existing .md file
- Light/Dark Mode
- Copy to Clipboard
- Word & Character Count
- Auto-save to browser
- Print & Clear

> Start writing to explore the features!
`;

function App() {
  const [markdown, setMarkdown] = React.useState(() => {
    return localStorage.getItem("markdown-content") || defaultMarkdown;
  });

  const [darkMode, setDarkMode] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const wordCount = markdown.trim().split(/\s+/).length;
  const charCount = markdown.length;

  // Auto-save
  React.useEffect(() => {
    localStorage.setItem("markdown-content", markdown);
  }, [markdown]);

  React.useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  const handleDownload = (type) => {
    const blob = type === "md"
      ? new Blob([markdown], { type: "text/markdown" })
      : new Blob([marked.parse(markdown)], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `preview.${type}`;
    link.click();
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith(".md")) {
      const reader = new FileReader();
      reader.onload = (e) => setMarkdown(e.target.result);
      reader.readAsText(file);
    } else {
      alert("Please upload a valid .md file");
    }
  };

  const handlePrint = () => {
    const win = window.open("", "_blank");
    win.document.write(marked.parse(markdown));
    win.document.close();
    win.print();
  };

  const showTip = () => {
    alert("💡 Markdown Tips:\n- Use `#` for headings\n- `**bold**`, `*italic*`\n- `> quote`, `- list`, \`code\`");
  };

  const handleClear = () => {
    if (confirm("Clear everything?")) setMarkdown("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="container">
      <h1>📝 Advanced Markdown Previewer</h1>

      <div className="controls">
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
        <button onClick={() => handleDownload("md")}>⬇️ .md</button>
        <button onClick={() => handleDownload("html")}>⬇️ .html</button>
        <button onClick={handleCopy}>{copied ? "✅ Copied!" : "📋 Copy"}</button>
        <button onClick={handlePrint}>🖨️ Print</button>
        <button onClick={showTip}>💡 Tip</button>
        <button onClick={handleClear}>🧹 Clear</button>
        <label style={{ cursor: "pointer" }}>
          📂 Upload
          <input type="file" accept=".md" hidden onChange={handleUpload} />
        </label>
      </div>

      <div style={{ textAlign: "center", marginBottom: "10px", fontSize: "0.9rem", color: darkMode ? "#ccc" : "#444" }}>
        📝 {wordCount} words | 🔠 {charCount} characters
      </div>

      <textarea
        id="editor"
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        className={darkMode ? "dark" : ""}
      />

      <div
        id="preview"
        className={`preview ${darkMode ? "dark" : ""}`}
        dangerouslySetInnerHTML={{ __html: marked.parse(markdown) }}
      />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
