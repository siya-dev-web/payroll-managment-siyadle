/**
 * Extract and sanitise pagination + sorting params from a query string.
 *
 * @param {import('express').Request['query']} query
 * @param {string[]} allowedSortFields  Whitelist of column names the caller permits for ORDER BY.
 * @returns {{ limit: number, offset: number, page: number, orderBy: string, orderDir: string }}
 */
export function getPaginationParams(query, allowedSortFields = []) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
  const offset = (page - 1) * limit;

  const requestedSort = (query.sort || "").toString().trim();
  const orderBy = allowedSortFields.includes(requestedSort)
    ? requestedSort
    : allowedSortFields[0] || "id";

  const orderDir = query.order?.toString().toUpperCase() === "ASC" ? "ASC" : "DESC";

  return { page, limit, offset, orderBy, orderDir };
}

/**
 * Build the standard pagination metadata block.
 *
 * @param {{ page: number, limit: number }} params
 * @param {number} total  Total number of records matching the query.
 * @returns {{ total: number, page: number, limit: number, totalPages: number }}
 */
export function buildPaginationMeta(params, total) {
  return {
    total,
    page: params.page,
    limit: params.limit,
    totalPages: Math.ceil(total / params.limit),
  };
}
