import { TabItem } from './tab-item';
import { TabGroup } from './tab-group';
import { VirtualizedTabList } from './virtualized-tab-list';
import type { Tab, TabGroup as TabGroupType } from '../types';

interface TabListProps {
  tabs: Tab[];
  groups?: TabGroupType[];
  isGrouped?: boolean;
  onCloseTab?: (tabId: number) => void;
  onNavigateToTab?: (tabId: number, windowId: number) => void;
  onToggleGroupExpansion?: (groupId: string) => void;
}

export function TabList({
  tabs,
  groups = [],
  isGrouped = false,
  onCloseTab,
  onNavigateToTab,
  onToggleGroupExpansion
}: TabListProps) {
  // Determine what to show based on mode and content
  const hasContent = isGrouped ? groups.length > 0 : tabs.length > 0;

  if (!hasContent) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        Aucun onglet trouvé
      </div>
    );
  }

  // Grouped view
  if (isGrouped) {
    return (
      <div className="space-y-3">
        {groups.map((group) => (
          <TabGroup
            key={group.id}
            group={group}
            onToggleExpansion={onToggleGroupExpansion}
            onCloseTab={onCloseTab}
            onNavigateToTab={onNavigateToTab}
          />
        ))}
      </div>
    );
  }

  // Normal list view - use virtualization for large lists
  const shouldVirtualize = tabs.length > 50;
  const maxHeight = 600; // Max height of popup viewport

  if (shouldVirtualize) {
    return (
      <VirtualizedTabList
        tabs={tabs}
        height={Math.min(maxHeight, tabs.length * 70)}
        onCloseTab={onCloseTab}
        onNavigateToTab={onNavigateToTab}
      />
    );
  }

  return (
    <div className="space-y-2">
      {tabs.map((tab) => (
        <TabItem key={tab.id} tab={tab} onClose={onCloseTab} onNavigate={onNavigateToTab} />
      ))}
    </div>
  );
}