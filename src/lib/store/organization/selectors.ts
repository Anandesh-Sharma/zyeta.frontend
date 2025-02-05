import { selector } from 'recoil';
import { organizationsState, currentOrgIdState } from './atoms';
import { Organization } from '@/lib/types';

export const currentOrganizationState = selector<Organization | null>({
  key: 'currentOrganizationState',
  get: ({ get }) => {
    const orgs = get(organizationsState);
    const currentId = get(currentOrgIdState);
    return orgs.find(org => org.id === currentId) || null;
  },
});