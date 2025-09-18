import { TabItem } from './tab-item';
import type { Tab } from '../types';

interface TabListProps {
  tabs: Tab[];
  onCloseTab?: (tabId: number) => void;
}

export function TabList({ tabs, onCloseTab }: TabListProps) {
  if (tabs.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        Aucun onglet trouvé
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tabs.map((tab) => (
        <TabItem key={tab.id} tab={tab} onClose={onCloseTab} />
      ))}
    </div>
  );
}