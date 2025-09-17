import { FileIcon } from 'lucide-react';
import { extractDomain } from '../utils/url-utils';
import type { Tab } from '../types';
import { cn } from '../../../lib/utils';

interface TabItemProps {
  tab: Tab;
}

export function TabItem({ tab }: TabItemProps) {
  return (
    <div
      data-testid="tab-item"
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors",
        tab.active && "bg-accent"
      )}
    >
      {/* Favicon */}
      <div className="flex-shrink-0 w-4 h-4">
        {tab.favIconUrl ? (
          <img
            src={tab.favIconUrl}
            alt={`${tab.title} favicon`}
            className="w-4 h-4 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <FileIcon 
          data-testid="default-tab-icon"
          className={cn(
            "w-4 h-4 text-muted-foreground",
            tab.favIconUrl && "hidden"
          )} 
        />
      </div>

      {/* Tab content */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">
          {tab.title || 'Sans titre'}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {extractDomain(tab.url)}
        </div>
      </div>
    </div>
  );
}