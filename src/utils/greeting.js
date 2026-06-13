export function getGreeting(t) {
  const hour = new Date().getHours();
  if (hour < 12) return t ? t("greeting.morning") : "Good Morning";
  if (hour < 18) return t ? t("greeting.afternoon") : "Good Afternoon";
  return t ? t("greeting.evening") : "Good Evening";
}
