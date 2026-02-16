import { useChatState } from "./useChatState";
import { useFileManager } from "./useFileManager";
import { useProjectConfig } from "./useProjectConfig";
import { useResizablePanels } from "./useResizablePanels";

export {
  CHAT_MAX,
  CHAT_MIN,
  EDITOR_MIN,
  FILES_MAX,
  FILES_MIN,
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
