export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

export interface OrganizationStore {
  organizations: Organization[];
  currentOrgId: string | null;
}

export type OrganizationAction = 
  | { type: 'SET_CURRENT_ORG'; payload: string }
  | { type: 'SET_ORGANIZATIONS'; payload: Organization[] }
  | { type: 'ADD_ORGANIZATION'; payload: Organization }
  | { type: 'UPDATE_ORGANIZATION'; payload: { id: string; updates: Partial<Organization> } };