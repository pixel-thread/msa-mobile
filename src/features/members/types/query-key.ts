export type MemberQueryKeysType = {
  all: (page?: number) => readonly ['members', number | undefined];
  detail: (id: string) => readonly ['members', string];
};
