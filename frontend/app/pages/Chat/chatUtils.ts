import type { BasicListModel } from "~/types/roles/models";

export type AuthUserLike = {
  id?: number | string;
  userId?: number | string;
  email?: string;
  name?: string;
  phone?: string;
  role?: string;
};

export function normalizeCurrentUser(
  user: AuthUserLike | null
): BasicListModel | null {
  if (!user?.email || !user?.role) {
    return null;
  }

  const normalizedId = getNumericId(user.userId) ?? getNumericId(user.id);

  return {
    id: normalizedId,
    name: user.name ?? user.email,
    email: user.email,
    phone: user.phone ?? "",
    userType: user.role as BasicListModel["userType"],
  } satisfies BasicListModel;
}

export function getNumericId(value?: number | string): number | undefined {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}
