type Props = {
  error?: { message?: string };
};

export function FormErrorMessage({ error }: Props) {
  if (!error?.message) return null;

  return <p className="text-sm text-red-600">{error.message}</p>;
}
