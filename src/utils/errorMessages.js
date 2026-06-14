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

const NETWORK_PATTERNS = [
  "network",
  "timeout",
  "econnrefused",
  "econnreset",
  "enotfound",
  "fetch",
  "internet",
  "offline",
  "request failed",
  "network request failed",
  "unable to connect",
  "connection refused",
  "network error",
];

const QUOTA_PATTERNS = [
  "quota",
  "rate limit",
  "ratelimit",
  "too many requests",
  "limit exceeded",
  "credit",
  "insufficient",
  "billing",
  "payment required",
];

const IMAGE_GEN_PATTERNS = [
  "image generation",
  "generation failed",
  "failed to generate",
  "generate",
  "stable diffusion",
  "dalle",
  "openai",
  "midjourney",
  "replicate",
  "fal.ai",
  "fal-ai",
  "prediction",
];

const SENSITIVE_PATTERNS = [
  "api key",
  "token",
  "invalid key",
  "missing key",
  "secret",
  "credential",
  "api_key",
  "apikey",
];

function matchesPatterns(message, patterns) {
  const lower = message.toLowerCase();
  return patterns.some(p => lower.includes(p));
}

function getServerMessage(error) {
  if (!error) return null;
  if (typeof error === "string") return error;
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.response?.data?.detail ||
    error?.message ||
    error?.msg ||
    null
  );
}

function getHttpStatus(error) {
  return error?.response?.status || error?.status || null;
}

export function getUserFriendlyErrorMessage(error, t) {
  const status = getHttpStatus(error);
  const rawMsg = getServerMessage(error);

  if (status === 429 || (rawMsg && matchesPatterns(rawMsg, QUOTA_PATTERNS))) {
    return t("errors.quotaReached");
  }

  if (
    status === 0 ||
    (rawMsg && matchesPatterns(rawMsg, NETWORK_PATTERNS))
  ) {
    return t("errors.networkError");
  }

  if (rawMsg && matchesPatterns(rawMsg, SENSITIVE_PATTERNS)) {
    return t("errors.generic");
  }

  if (rawMsg && matchesPatterns(rawMsg, IMAGE_GEN_PATTERNS)) {
    return t("errors.imageGenerationFailed");
  }

  if (status === 401 || status === 403) {
    return t("errors.authError");
  }

  if (status >= 500) {
    return t("errors.serverError");
  }

  return t("errors.generic");
}
