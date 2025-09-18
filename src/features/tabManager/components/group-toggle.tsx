import { Grid3X3, List, Expand, Minimize2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';

interface GroupToggleProps {
  isGroupingEnabled: boolean;
  onToggleGrouping: () => void;
  onExpandAll?: () => void;
  onCollapseAll?: () => void;
  expandedGroups: number;
  totalGroups: number;
}

export function GroupToggle({
  isGroupingEnabled,
  onToggleGrouping,
  onExpandAll,
  onCollapseAll,
  expandedGroups,
  totalGroups
}: GroupToggleProps) {
  const allExpanded = expandedGroups === totalGroups;
  const allCollapsed = expandedGroups === 0;

  return (
    <div className="flex items-center gap-2">
      {/* Group/List Toggle */}
      <div className="flex rounded-md border">
        <Button
          variant={isGroupingEnabled ? "default" : "ghost"}
          size="sm"
          onClick={onToggleGrouping}
          className={cn(
            "rounded-r-none border-r",
            isGroupingEnabled && "bg-primary text-primary-foreground"
          )}
          aria-label="Vue groupée"
        >
          <Grid3X3 className="w-4 h-4" />
        </Button>
        <Button
          variant={!isGroupingEnabled ? "default" : "ghost"}
          size="sm"
          onClick={onToggleGrouping}
          className={cn(
            "rounded-l-none",
            !isGroupingEnabled && "bg-primary text-primary-foreground"
          )}
          aria-label="Vue liste"
        >
          <List className="w-4 h-4" />
        </Button>
      </div>

      {/* Expand/Collapse Controls (only when grouping is enabled) */}
      {isGroupingEnabled && totalGroups > 0 && (
        <>
          <div className="w-px h-6 bg-border" />

          <Button
            variant="ghost"
            size="sm"
            onClick={onExpandAll}
            disabled={allExpanded}
            className="flex items-center gap-1"
            aria-label="Développer tous les groupes"
          >
            <Expand className="w-4 h-4" />
            <span className="text-xs">Tout développer</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onCollapseAll}
            disabled={allCollapsed}
            className="flex items-center gap-1"
            aria-label="Réduire tous les groupes"
          >
            <Minimize2 className="w-4 h-4" />
            <span className="text-xs">Tout réduire</span>
          </Button>
        </>
      )}

      {/* Groups Status */}
      {isGroupingEnabled && totalGroups > 0 && (
        <div className="text-xs text-muted-foreground ml-2">
          {expandedGroups}/{totalGroups} groupes développés
        </div>
      )}
    </div>
  );
}