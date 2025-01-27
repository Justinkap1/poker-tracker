export type Message =
  | { success: string }
  | { error: string }
  | { message: string }
  | { session: string }

export function FormMessage({ message }: { message: Message }) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-md text-md">
      {"success" in message && (
        <div className="flex text-green-500 border-foreground justify-center">
          <div className="flex flex-row gap-2">
            <span className="border-l-2 border-foreground"></span>
            <span>{message.success}</span>
          </div>
        </div>
      )}
      {"error" in message && (
        <div className="text-destructive-foreground border-l-2 border-destructive-foreground px-4">
          {message.error}
        </div>
      )}
      {"message" in message && (
        <div className="text-foreground border-l-2 px-4">{message.message}</div>
      )}
      {"session" in message && (
        <div className="text-foreground border-l-2 px-4">{message.session}</div>
      )}
    </div>
  );
}
