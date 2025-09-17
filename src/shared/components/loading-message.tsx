interface LoadingMessageProps {
  message: string;
}

export function LoadingMessage({ message }: LoadingMessageProps) {
  return (
    <div className="p-4 text-center">
      <div className="text-muted-foreground">{message}</div>
    </div>
  );
}