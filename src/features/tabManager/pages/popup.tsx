import { useState } from 'react';
import { useTabs } from '../hooks/use-tabs';
import { useTabSearch } from '../hooks/use-tab-search';
import { TabList } from '../components/tab-list';
import { SearchInput } from '../components/search-input';
import { ErrorMessage } from '../../../shared/components/error-message';
import { LoadingMessage } from '../../../shared/components/loading-message';
import { Header } from '../components/header';

export function Popup() {
  const { tabs, isLoading, error } = useTabs();
  const [searchTerm, setSearchTerm] = useState('');
  const { filteredTabs, hasResults } = useTabSearch(tabs, searchTerm);

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (isLoading) {
    return <LoadingMessage message="Chargement des onglets..." />;
  }

  return (
    <div className="w-80 max-h-96 overflow-auto">
      <Header title="TabZen" tabCount={tabs.length} />
      <div className="p-4 space-y-4">
        <SearchInput 
          value={searchTerm} 
          onChange={setSearchTerm}
          autoFocus
        />
        {!hasResults && searchTerm ? (
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            Aucun onglet trouvé pour &ldquo;{searchTerm}&rdquo;
          </div>
        ) : (
          <TabList tabs={filteredTabs} />
        )}
      </div>
    </div>
  );
}