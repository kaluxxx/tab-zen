interface HeaderProps {
  title: string;
  tabCount: number;
}

export function Header({ title, tabCount }: HeaderProps) {
  return (
    <div className="p-4 border-b">
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground">
        {tabCount} onglet{tabCount > 1 ? 's' : ''} ouvert{tabCount > 1 ? 's' : ''}
      </p>
    </div>
  );
}