import { db } from './drizzle';
import { eq } from 'drizzle-orm/expressions';
import { User } from '../types/User';

export const getUserProfile = async (userId: string): Promise<User | null> => {
  const result = await db.select('*').from('users').where(eq('id', userId));
  return result.length ? result[0] : null;
};

export const getUserProfileById = async (id: string): Promise<User | null> => {
  const result = await db.select('*').from('users').where(eq('id', id));
  return result.length ? result[0] : null;
};

export const updateUserProfile = async (userId: string, profileData: User): Promise<User | null> => {
  const [updatedProfile] = await db.update('users').set(profileData).where(eq('id', userId)).returning('*');
  return updatedProfile;
};