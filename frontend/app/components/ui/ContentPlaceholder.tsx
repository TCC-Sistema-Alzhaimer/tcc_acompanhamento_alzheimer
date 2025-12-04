interface ContentPlaceholderProps {
  message: string;
}

export function ContentPlaceholder({ message }: ContentPlaceholderProps) {
  return (
    <div className="flex items-center justify-center h-full text-gray-800 p-6 rounded-lg border-2 border-dashed border-gray-300 bg-white">
      <p>{message}</p>
    </div>
  );
}
