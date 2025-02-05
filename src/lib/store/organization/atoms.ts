import { atom } from 'recoil';
import { Organization } from '@/lib/types';

const getStoredOrgId = () => {
  try {
    return localStorage.getItem('currentOrgId');
  } catch (e) {
    console.error('Failed to read from localStorage:', e);
    return null;
  }
};

export const organizationsState = atom<Organization[]>({
  key: 'organizationsState',
  default: [],
});

export const currentOrgIdState = atom<string | null>({
  key: 'currentOrgIdState',
  default: getStoredOrgId(),
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        try {
          if (newValue) {
            localStorage.setItem('currentOrgId', newValue);
          } else {
            localStorage.removeItem('currentOrgId');
          }
        } catch (e) {
          console.error('Failed to write to localStorage:', e);
        }
      });
    },
  ],
});