// user.ts
export type User = {
  id: string;
  handle: string;
  email: string;
  password: string;
  is_mediator: boolean;
  profile_picture?: string;
  bio?: string;
  created_at: Date;
  last_login: Date | null;
};