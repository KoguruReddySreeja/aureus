/**
 * In-memory store for mock API data.
 * Replaces the backend's storage/store.js — data persists only for the
 * lifetime of the browser tab (resets on page refresh).
 */

let transactions = [];

export function getTransactions() {
  return [...transactions];
}

export function setTransactions(nextTransactions) {
  transactions = [...nextTransactions];
}
