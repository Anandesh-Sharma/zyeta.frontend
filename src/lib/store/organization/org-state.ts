// Static class to manage current organization state
class OrgState {
  private static currentOrgId: string | null = null;

  static setCurrentOrg(orgId: string) {
    this.currentOrgId = orgId;
    try {
      localStorage.setItem('currentOrgId', orgId);
    } catch (e) {
      console.error('Failed to write to localStorage:', e);
    }
  }

  static getCurrentOrg(): string | null {
    if (!this.currentOrgId) {
      try {
        this.currentOrgId = localStorage.getItem('currentOrgId');
      } catch (e) {
        console.error('Failed to read from localStorage:', e);
      }
    }
    return this.currentOrgId;
  }

  static clearCurrentOrg() {
    this.currentOrgId = null;
    try {
      localStorage.removeItem('currentOrgId');
    } catch (e) {
      console.error('Failed to remove from localStorage:', e);
    }
  }
}

export default OrgState;