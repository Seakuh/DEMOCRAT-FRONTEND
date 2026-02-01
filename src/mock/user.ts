import { User } from '../types';

const USER_STORAGE_KEY = 'user.id';

function generateUserId(): string {
  return `user-${Math.random().toString(36).substring(2, 15)}`;
}

export function getCurrentUser(): User {
  let userId = localStorage.getItem(USER_STORAGE_KEY);

  if (!userId) {
    userId = generateUserId();
    localStorage.setItem(USER_STORAGE_KEY, userId);
  }

  return {
    id: userId,
    displayName: `Bürger ${userId.substring(5, 10).toUpperCase()}`,
  };
}
