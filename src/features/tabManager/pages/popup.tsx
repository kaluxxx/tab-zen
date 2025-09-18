import { useState, useCallback } from 'react';
import { useTabs } from '../hooks/use-tabs';
import { useTabSearch } from '../hooks/use-tab-search';
import { useTabGrouping } from '../hooks/use-tab-grouping';
import { TabList } from '../components/tab-list';
import { SearchInput } from '../components/search-input';
import { GroupToggle } from '../components/group-toggle';
import { ErrorMessage } from '../../../shared/components/error-message';
import { LoadingMessage } from '../../../shared/components/loading-message';
import { Header } from '../components/header';
import { tabService } from '../services/tab-service';

export function Popup() {
  const { tabs, isLoading, error, refetch } = useTabs();
  const [searchTerm, setSearchTerm] = useState('');
  const { filteredTabs, hasResults } = useTabSearch(tabs, searchTerm);

  // Grouping functionality
  const {
    groups,
    isGroupingEnabled,
    expandedGroups,
    toggleGrouping,
    toggleGroupExpansion,
    expandAllGroups,
    collapseAllGroups,
    isLoading: isGroupingLoading,
    error: groupingError,
    refetch: refetchGroups,
  } = useTabGrouping();

  const handleCloseTab = useCallback(async (tabId: number) => {
    try {
      await tabService.closeTab(tabId);
      refetch(); // Refetch regular tabs
      refetchGroups(); // Refetch grouped tabs
    } catch (error) {
      console.error('Failed to close tab:', error);
    }
  }, [refetch, refetchGroups]);

  const handleNavigateToTab = useCallback(async (tabId: number, windowId: number) => {
    try {
      await tabService.switchToTab(tabId, windowId);
      // Close the popup after successful navigation
      window.close();
    } catch (error) {
      console.error('Failed to navigate to tab:', error);
    }
  }, []);

  if (error || groupingError) {
    return <ErrorMessage message={error?.message || groupingError?.message || 'Une erreur est survenue'} />;
  }

  if (isLoading || isGroupingLoading) {
    return <LoadingMessage message="Chargement des onglets..." />;
  }

  return (
    <div className="w-[500px] max-h-[1000px] overflow-auto">
      <Header title="TabZen" tabCount={tabs.length} />
      <div className="p-4 space-y-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          autoFocus
        />

        {/* Grouping Controls - only show when not searching */}
        {!searchTerm && (
          <GroupToggle
            isGroupingEnabled={isGroupingEnabled}
            onToggleGrouping={toggleGrouping}
            onExpandAll={expandAllGroups}
            onCollapseAll={collapseAllGroups}
            expandedGroups={expandedGroups}
            totalGroups={groups.length}
          />
        )}

        {!hasResults && searchTerm ? (
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            Aucun onglet trouvé pour &ldquo;{searchTerm}&rdquo;
          </div>
        ) : (
          <TabList
            tabs={filteredTabs}
            groups={groups}
            isGrouped={isGroupingEnabled && !searchTerm}
            onCloseTab={handleCloseTab}
            onNavigateToTab={handleNavigateToTab}
            onToggleGroupExpansion={toggleGroupExpansion}
          />
        )}
      </div>
    </div>
  );
}