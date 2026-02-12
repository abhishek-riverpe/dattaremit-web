export const queryKeys = {
  users: { me: ["users", "me"] as const },
  account: ["account"] as const,
  addresses: {
    all: ["addresses"] as const,
    detail: (id: string) => ["addresses", id] as const,
  },
} as const;
