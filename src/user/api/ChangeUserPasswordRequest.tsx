export type ChangeUserPasswordRequest = {
  userId: number;

  currentPassword: string;

  newPassword: string;
};
