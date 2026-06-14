export function extractErrorMessage(error, fallback) {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  const msg =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    error?.msg ||
    null;
  return msg || fallback;
}
