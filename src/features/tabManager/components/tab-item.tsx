import { FileIcon, X } from 'lucide-react';
import { memo } from 'react';
import { extractDomain } from '../utils/url-utils';
import type { Tab } from '../types';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/ui/button';

interface TabItemProps {
  tab: Tab;
  onClose?: (tabId: number) => void;
  onNavigate?: (tabId: number, windowId: number) => void;
}

export const TabItem = memo(function TabItem({ tab, onClose, onNavigate }: TabItemProps) {
  return (
    <div
      data-testid="tab-item"
      onClick={() => onNavigate?.(tab.id, tab.windowId)}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors",
        tab.active && "bg-accent",
        onNavigate && "cursor-pointer"
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

      {/* Close button */}
      {onClose && (
        <Button
          data-testid="close-tab-button"
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onClose(tab.id);
          }}
          className="flex-shrink-0 h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
          aria-label={`Fermer l'onglet ${tab.title}`}
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
});