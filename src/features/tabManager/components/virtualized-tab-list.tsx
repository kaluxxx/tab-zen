import { FixedSizeList } from 'react-window';
import { memo } from 'react';
import { TabItem } from './tab-item';
import type { Tab } from '../types';

interface VirtualizedTabListProps {
  tabs: Tab[];
  height: number;
  onCloseTab?: (tabId: number) => void;
  onNavigateToTab?: (tabId: number, windowId: number) => void;
}

interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    tabs: Tab[];
    onCloseTab?: (tabId: number) => void;
    onNavigateToTab?: (tabId: number, windowId: number) => void;
  };
}

const Row = memo(function Row({ index, style, data }: RowProps) {
  const { tabs, onCloseTab, onNavigateToTab } = data;
  const tab = tabs[index];

  if (!tab) {
    return null;
  }

  return (
    <div style={style} className="px-1">
      <div className="pb-2">
        <TabItem
          tab={tab}
          onClose={onCloseTab}
          onNavigate={onNavigateToTab}
        />
      </div>
    </div>
  );
});

export const VirtualizedTabList = memo(function VirtualizedTabList({
  tabs,
  height,
  onCloseTab,
  onNavigateToTab
}: VirtualizedTabListProps) {
  const itemData = {
    tabs,
    onCloseTab,
    onNavigateToTab
  };

  return (
    <FixedSizeList
      height={height}
      itemCount={tabs.length}
      itemSize={70} // TabItem height + padding
      itemData={itemData}
      overscanCount={5}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
});