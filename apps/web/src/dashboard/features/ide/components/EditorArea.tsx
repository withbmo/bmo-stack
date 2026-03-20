import { FileCode, X } from 'lucide-react';

import { useIdeStore } from '../stores/ide-store';
import { getFileIcon } from '../utils/get-file-icon';

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
  const lineCount = content.split('\n').length || 1;

  return (
    <div className="flex h-full overflow-hidden bg-bg-app font-mono text-sm">
      <div className="w-12 select-none border-r border-border-default/20 bg-bg-panel py-4 pr-3 text-right text-text-muted/40">
        {Array.from({ length: lineCount }).map((_, i) => (
          <div key={i} className="leading-6">
            {i + 1}
          </div>
        ))}
      </div>
      <textarea
        className="flex-1 resize-none bg-transparent p-4 font-mono leading-6 text-white selection:bg-brand-primary/40 focus:outline-none"
        value={content}
        spellCheck={false}
        onChange={e => onChange(e.target.value)}
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
    activeFileId != null ? fileContents[activeFileId] ?? '' : '';
  const activeMeta = activeFileId != null ? files[activeFileId] : null;

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-bg-app">
      <div className="flex min-h-0 flex-grow flex-col">
        <div className="editor-tabs-scroll flex h-10 shrink-0 items-center overflow-x-auto border-b border-border-default bg-bg-panel">
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
                className={`flex h-full shrink-0 cursor-pointer items-center gap-2 border-r border-border-default/50 px-4 font-mono text-xs transition-colors ${
                  isActive
                    ? 'border-t-2 border-t-brand-primary bg-bg-app text-white'
                    : 'text-text-muted hover:bg-border-default/20 hover:text-white'
                }`}
              >
                {getFileIcon(meta.name, 'file')}
                <span className="truncate max-w-[120px]">{meta.name}</span>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    closeFile(fileId);
                  }}
                  className="rounded p-0.5 text-text-muted hover:bg-border-default/50 hover:text-white"
                  aria-label={`Close ${meta.name}`}
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>
        <div className="relative flex-1 overflow-auto">
          {activeFileId && activeMeta ? (
            <CodeEditor
              content={activeContent}
              name={activeMeta.name}
              language={activeMeta.language}
              onChange={(val) => updateFileContent(activeFileId, val)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-text-muted opacity-50">
              <FileCode size={48} className="mb-4" />
              <p className="font-mono text-sm">SELECT_FILE_TO_EDIT</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
