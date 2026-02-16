import { FileCode, X } from "lucide-react";

import { useIdeStore } from "../stores/ide-store";
import { getFileIcon } from "../utils/get-file-icon";

export interface CodeEditorProps {
  content: string;
  name: string;
  language: string;
  onChange: (val: string) => void;
}

export const CodeEditor = ({
  content,
  name,
  language,
  onChange,
}: CodeEditorProps) => {
  const lineCount = content.split("\n").length || 1;

  return (
    <div className="h-full flex font-mono text-sm overflow-hidden bg-[#0C0C0C]">
      <div className="w-12 bg-[#0A0A0A] border-r border-nexus-gray/20 text-nexus-muted/40 text-right pr-3 py-4 select-none">
        {Array.from({ length: lineCount }).map((_, i) => (
          <div key={i} className="leading-6">
            {i + 1}
          </div>
        ))}
      </div>
      <textarea
        className="flex-1 bg-transparent text-white p-4 focus:outline-none resize-none leading-6 font-mono selection:bg-nexus-purple/40"
        value={content}
        spellCheck={false}
        onChange={(e) => onChange(e.target.value)}
        data-file-name={name}
        data-language={language}
      />
    </div>
  );
};

export const EditorArea = () => {
  const files = useIdeStore((s) => s.files);
  const fileContents = useIdeStore((s) => s.fileContents);
  const openFileIds = useIdeStore((s) => s.openFileIds);
  const activeFileId = useIdeStore((s) => s.activeFileId);
  const setActiveFile = useIdeStore((s) => s.setActiveFile);
  const closeFile = useIdeStore((s) => s.closeFile);
  const updateFileContent = useIdeStore((s) => s.updateFileContent);

  const activeContent =
    activeFileId != null ? fileContents[activeFileId] ?? "" : "";
  const activeMeta = activeFileId != null ? files[activeFileId] : null;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#0C0C0C]">
      <div className="flex-grow flex flex-col min-h-0">
        <div className="editor-tabs-scroll h-10 shrink-0 flex items-center border-b border-nexus-gray bg-[#080808] overflow-x-auto">
          {openFileIds.map((fileId) => {
            const meta = files[fileId];
            if (!meta) return null;
            const isActive = activeFileId === fileId;
            return (
              <div
                key={fileId}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFile(fileId)}
                className={`h-full px-4 flex items-center gap-2 border-r border-nexus-gray/50 text-xs font-mono shrink-0 cursor-pointer transition-colors ${
                  isActive
                    ? "bg-[#0C0C0C] border-t-2 border-t-nexus-purple text-white"
                    : "text-nexus-muted hover:text-white hover:bg-nexus-gray/20"
                }`}
              >
                {getFileIcon(meta.name, "file")}
                <span className="truncate max-w-[120px]">{meta.name}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeFile(fileId);
                  }}
                  className="p-0.5 rounded hover:bg-nexus-gray/50 text-nexus-muted hover:text-white"
                  aria-label={`Close ${meta.name}`}
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex-1 relative overflow-auto">
          {activeFileId && activeMeta ? (
            <CodeEditor
              content={activeContent}
              name={activeMeta.name}
              language={activeMeta.language}
              onChange={(val) => updateFileContent(activeFileId, val)}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-nexus-muted opacity-50">
              <FileCode size={48} className="mb-4" />
              <p className="font-mono text-sm">SELECT_FILE_TO_EDIT</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
