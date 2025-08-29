export type LoginResponse = {
  token: string;
  token_type: "bearer";
  role: string;
  email: string;
  id: string;
};
