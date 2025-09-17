import { useTabs } from '../hooks/use-tabs';
import { TabList } from '../components/tab-list';
import { ErrorMessage } from '../../../shared/components/error-message';
import { LoadingMessage } from '../../../shared/components/loading-message';
import { Header } from '../components/header';

export function Popup() {
  const { tabs, isLoading, error } = useTabs();

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (isLoading) {
    return <LoadingMessage message="Chargement des onglets..." />;
  }

  return (
    <div className="w-80 max-h-96 overflow-auto">
      <Header title="TabZen" tabCount={tabs.length} />
      <div className="p-4">
        <TabList tabs={tabs} />
      </div>
    </div>
  );
}