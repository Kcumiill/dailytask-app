import { differenceInHours, differenceInDays, isPast, format, isToday, isTomorrow } from "date-fns";
import { ru } from "date-fns/locale";

export type DeadlineStatus = "urgent" | "warning" | "safe" | "passed" | "none";

export function getDeadlineStatus(deadline: string | null): DeadlineStatus {
  if (!deadline) return "none";
  const date = new Date(deadline);
  if (isPast(date)) return "passed";
  const hours = differenceInHours(date, new Date());
  if (hours < 24) return "urgent";
  if (hours < 72) return "warning";
  return "safe";
}

export function formatDeadline(deadline: string | null): string {
  if (!deadline) return "";
  const date = new Date(deadline);
  if (isPast(date)) return `Просрочено: ${format(date, "d MMM", { locale: ru })}`;
  if (isToday(date)) return `Сегодня, ${format(date, "HH:mm")}`;
  if (isTomorrow(date)) return `Завтра, ${format(date, "HH:mm")}`;
  const days = differenceInDays(date, new Date());
  if (days < 7) return format(date, "EEEE, HH:mm", { locale: ru });
  return format(date, "d MMM yyyy", { locale: ru });
}
