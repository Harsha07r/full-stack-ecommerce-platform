export const formatPrice = (n) => `₹${n.toLocaleString('en-IN')}`;

export const totalStock = (sizes = []) => sizes.reduce((sum, s) => sum + s.stock, 0);