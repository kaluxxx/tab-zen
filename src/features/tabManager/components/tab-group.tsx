import { ChevronDown, ChevronRight } from 'lucide-react';
import { memo } from 'react';
import type { TabGroup as TabGroupType } from '../types';
import { TabItem } from './tab-item';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/ui/button';
import { getCategoryColor } from '../utils/category-colors';

interface TabGroupProps {
  group: TabGroupType;
  onToggleExpansion?: (groupId: string) => void;
  onCloseTab?: (tabId: number) => void;
  onNavigateToTab?: (tabId: number, windowId: number) => void;
}

export const TabGroup = memo(function TabGroup({
  group,
  onToggleExpansion,
  onCloseTab,
  onNavigateToTab
}: TabGroupProps) {
  const handleToggleExpansion = () => {
    onToggleExpansion?.(group.id);
  };

  return (
    <div
      data-testid="tab-group"
      className="border rounded-lg overflow-hidden bg-card"
    >
      {/* Group Header */}
      <div className="flex items-center gap-2 p-3 bg-muted/30 border-b">
        {/* Expand/Collapse Icon */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0 hover:bg-accent"
          onClick={handleToggleExpansion}
          aria-label={group.isExpanded ? 'Réduire le groupe' : 'Développer le groupe'}
        >
          {group.isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </Button>

        {/* Group Name and Badge - also clickable for better UX */}
        <div
          className="flex-1 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleToggleExpansion}
        >
          <h3 className="font-medium text-sm">{group.name}</h3>
          <span
            className={cn(
              "px-2 py-1 text-xs font-medium rounded-full",
              getCategoryColor(group.category)
            )}
          >
            {group.tabs.length}
          </span>
        </div>
      </div>

      {/* Group Content */}
      {group.isExpanded && (
        <div className="divide-y">
          {group.tabs.map((tab) => (
            <div key={tab.id} className="p-2">
              <TabItem
                tab={tab}
                onClose={onCloseTab}
                onNavigate={onNavigateToTab}
              />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {group.isExpanded && group.tabs.length === 0 && (
        <div className="p-4 text-center text-muted-foreground text-sm">
          Aucun onglet dans ce groupe
        </div>
      )}
    </div>
  );
});