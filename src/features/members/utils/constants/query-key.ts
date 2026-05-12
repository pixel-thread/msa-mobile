export const MemberQueryKeys = {
  all: (page?: number) => ['members', page] as const,
  detail: (id: string) => ['members', id] as const,
};
