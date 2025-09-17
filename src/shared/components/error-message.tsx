interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="p-4 text-center">
      <div className="text-destructive mb-2">Erreur</div>
      <div className="text-sm text-muted-foreground">
        {message}
      </div>
    </div>
  );
}