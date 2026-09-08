export type Session = {
  user: { name: string; email: string; role: string };
  createdAt: number;
  expiresAt: number;
};
