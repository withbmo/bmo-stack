import { useFileManager } from "./useFileManager";
import { useChatState } from "./useChatState";
import { useResizablePanels } from "./useResizablePanels";
import { useProjectConfig } from "./useProjectConfig";

export {
  CHAT_MIN,
  CHAT_MAX,
  FILES_MIN,
  FILES_MAX,
  EDITOR_MIN,
} from "./useResizablePanels";

export function useIdeState(projectId: string | undefined) {
  const fileManager = useFileManager();
  const chat = useChatState(fileManager.activeFile ?? null);
  const panels = useResizablePanels();
  const projectConfig = useProjectConfig(projectId);

  return {
    ...fileManager,
    ...chat,
    ...panels,
    ...projectConfig,
  };
}
