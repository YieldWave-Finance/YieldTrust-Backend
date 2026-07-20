/**
 * In-memory data store for escrow and grant data.
 * In production, this would be replaced with a database.
 */

const escrows = [];
const grants = [];
let escrowIdCounter = 1;
let grantIdCounter = 1;

/**
 * Escrow operations
 */
const escrowService = {
  // Create new escrow
  create: (escrowData) => {
    const id = escrowIdCounter++;
    const newEscrow = {
      id,
      ...escrowData,
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    escrows.push(newEscrow);
    return newEscrow;
  },

  // Get all escrows
  getAll: () => {
    return [...escrows];
  },

  // Get escrow by ID
  getById: (id) => {
    return escrows.find((e) => e.id === parseInt(id, 10));
  },

  // Update escrow
  update: (id, updates) => {
    const index = escrows.findIndex((e) => e.id === parseInt(id, 10));
    if (index === -1) return null;
    escrows[index] = {
      ...escrows[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return escrows[index];
  },

  // Delete escrow
  delete: (id) => {
    const index = escrows.findIndex((e) => e.id === parseInt(id, 10));
    if (index === -1) return false;
    escrows.splice(index, 1);
    return true;
  },
};

/**
 * Grant operations
 */
const grantService = {
  // Create new grant
  create: (grantData) => {
    const id = grantIdCounter++;
    const newGrant = {
      id,
      ...grantData,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    grants.push(newGrant);
    return newGrant;
  },

  // Get all grants
  getAll: () => {
    return [...grants];
  },

  // Get grant by ID
  getById: (id) => {
    return grants.find((g) => g.id === parseInt(id, 10));
  },

  // Update grant
  update: (id, updates) => {
    const index = grants.findIndex((g) => g.id === parseInt(id, 10));
    if (index === -1) return null;
    grants[index] = {
      ...grants[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return grants[index];
  },

  // Delete grant
  delete: (id) => {
    const index = grants.findIndex((g) => g.id === parseInt(id, 10));
    if (index === -1) return false;
    grants.splice(index, 1);
    return true;
  },

  // Get grants by beneficiary
  getByBeneficiary: (beneficiary) => {
    return grants.filter((g) => g.beneficiary === beneficiary);
  },

  // Update grant status
  updateStatus: (id, status) => {
    const index = grants.findIndex((g) => g.id === parseInt(id, 10));
    if (index === -1) return null;
    grants[index] = {
      ...grants[index],
      status,
      updatedAt: new Date().toISOString(),
    };
    return grants[index];
  },
};

module.exports = {
  escrowService,
  grantService,
};
