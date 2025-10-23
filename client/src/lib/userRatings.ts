import { Company } from './dataLoader';

export interface UserRating {
  companyId: string;
  rating: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'purposebuilt_user_ratings';

export const getUserRating = (company: Company): UserRating => {
  const ratings = getAllRatings();
  const companyId = company['Company name'] || company.id?.toString();
  
  return ratings[companyId] || {
    companyId,
    rating: 0,
    note: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const saveUserRating = (company: Company, rating: UserRating): void => {
  const ratings = getAllRatings();
  const companyId = company['Company name'] || company.id?.toString();
  
  ratings[companyId] = {
    ...rating,
    companyId,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
};

export const getAllRatings = (): Record<string, UserRating> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading ratings:', error);
    return {};
  }
};

export const deleteUserRating = (company: Company): void => {
  const ratings = getAllRatings();
  const companyId = company['Company name'] || company.id?.toString();
  
  delete ratings[companyId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
};

export const exportRatings = (): string => {
  return JSON.stringify(getAllRatings(), null, 2);
};

export const importRatings = (jsonString: string): boolean => {
  try {
    const ratings = JSON.parse(jsonString);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
    return true;
  } catch (error) {
    console.error('Error importing ratings:', error);
    return false;
  }
};

