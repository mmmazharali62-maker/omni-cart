"use client";

// Client-side download button: generates the file from text content in-browser.
export function DownloadButton({ filename, content }: { filename: string; content: string }) {
  function download() {
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <button onClick={download} className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
      Download CSV
    </button>
  );
}
