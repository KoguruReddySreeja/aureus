/**
 * Seed data generator — produces 40 realistic transactions spread across
 * the last 6 months. Called once on app start and again on data-reset.
 */
import { getTransactions, setTransactions } from './store.js';

// Simple UUID v4 generator (no external dependency needed)
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function randomDate(monthsAgo) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
  const end = new Date(now.getFullYear(), now.getMonth() - monthsAgo + 1, 0);
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

function randomAmount(min, max) {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

const seedData = [
  // ── 15 income transactions ──────────────────────────────────────
  // SaaS Revenue (6)
  { description: 'Stripe subscription revenue - Enterprise tier', type: 'income', category: 'SaaS Revenue', amount: randomAmount(20000, 36000) },
  { description: 'Stripe subscription revenue - Pro tier',       type: 'income', category: 'SaaS Revenue', amount: randomAmount(8000, 18000) },
  { description: 'Stripe subscription revenue - Starter plans',  type: 'income', category: 'SaaS Revenue', amount: randomAmount(4000, 8000) },
  { description: 'Annual license renewal - Acme Corp',           type: 'income', category: 'SaaS Revenue', amount: randomAmount(24000, 36000) },
  { description: 'Annual license renewal - BuildCo',             type: 'income', category: 'SaaS Revenue', amount: randomAmount(12000, 24000) },
  { description: 'Stripe MRR batch - monthly',                   type: 'income', category: 'SaaS Revenue', amount: randomAmount(6000, 14000) },
  // Consulting (4)
  { description: 'Strategy consulting - Meridian Partners',      type: 'income', category: 'Consulting', amount: randomAmount(8000, 15000) },
  { description: 'Consulting retainer - FinTech Advisory Group', type: 'income', category: 'Consulting', amount: randomAmount(8000, 15000) },
  { description: 'Freelance dev project - Atlas Dashboard',      type: 'income', category: 'Consulting', amount: randomAmount(8000, 15000) },
  { description: 'Product audit - NovaBridge',                   type: 'income', category: 'Consulting', amount: randomAmount(8000, 15000) },
  // Refund (3)
  { description: 'Refund - Cancelled vendor contract',           type: 'income', category: 'Refund', amount: randomAmount(800, 3000) },
  { description: 'Refund - AWS billing adjustment',              type: 'income', category: 'Refund', amount: randomAmount(800, 3000) },
  { description: 'Refund - Duplicate SaaS charge',               type: 'income', category: 'Refund', amount: randomAmount(800, 3000) },
  // Miscellaneous (2)
  { description: 'Insurance reimbursement',                      type: 'income', category: 'Miscellaneous', amount: randomAmount(1500, 5000) },
  { description: 'Interest income - Q3',                         type: 'income', category: 'Miscellaneous', amount: randomAmount(500, 2000) },

  // ── 25 expense transactions ─────────────────────────────────────
  // Payroll (8)
  { description: 'Monthly payroll - Engineering team',           type: 'expense', category: 'Payroll', amount: randomAmount(35000, 45000) },
  { description: 'Monthly payroll - Design team',               type: 'expense', category: 'Payroll', amount: randomAmount(15000, 22000) },
  { description: 'Monthly payroll - Operations',                type: 'expense', category: 'Payroll', amount: randomAmount(12000, 18000) },
  { description: 'Monthly payroll - Sales',                     type: 'expense', category: 'Payroll', amount: randomAmount(18000, 28000) },
  { description: 'Contractor invoice - Arjun Mehta (Design)',   type: 'expense', category: 'Payroll', amount: randomAmount(3000, 8000) },
  { description: 'Contractor invoice - Priya Nair (Marketing)', type: 'expense', category: 'Payroll', amount: randomAmount(3000, 7000) },
  { description: 'Freelancer payout - UI audit',                type: 'expense', category: 'Payroll', amount: randomAmount(2000, 5000) },
  { description: 'Bonus disbursement - Q4',                     type: 'expense', category: 'Payroll', amount: randomAmount(12000, 25000) },
  // Infrastructure (5)
  { description: 'AWS EC2 + RDS billing',                       type: 'expense', category: 'Infrastructure', amount: randomAmount(2000, 3500) },
  { description: 'Vercel Pro plan',                             type: 'expense', category: 'Infrastructure', amount: randomAmount(800, 1200) },
  { description: 'Cloudflare Teams',                            type: 'expense', category: 'Infrastructure', amount: randomAmount(800, 1500) },
  { description: 'GitHub Enterprise',                           type: 'expense', category: 'Infrastructure', amount: randomAmount(1000, 2500) },
  { description: 'Datadog monitoring',                          type: 'expense', category: 'Infrastructure', amount: randomAmount(1500, 3500) },
  // Marketing (4)
  { description: 'Google Ads - Performance Max',                type: 'expense', category: 'Marketing', amount: randomAmount(3000, 8000) },
  { description: 'LinkedIn Ads - B2B leads',                    type: 'expense', category: 'Marketing', amount: randomAmount(2000, 5000) },
  { description: 'Sponsorship - IndieHackers newsletter',       type: 'expense', category: 'Marketing', amount: randomAmount(2000, 4000) },
  { description: 'Webflow hosting annual',                      type: 'expense', category: 'Marketing', amount: randomAmount(800, 2000) },
  // Vendor Payment (4)
  { description: 'HubSpot CRM annual',                         type: 'expense', category: 'Vendor Payment', amount: randomAmount(2000, 5000) },
  { description: 'Notion for Teams',                            type: 'expense', category: 'Vendor Payment', amount: randomAmount(1000, 2000) },
  { description: 'QuickBooks accounting',                       type: 'expense', category: 'Vendor Payment', amount: randomAmount(1000, 3000) },
  { description: 'Figma Organization plan',                     type: 'expense', category: 'Vendor Payment', amount: randomAmount(1500, 4000) },
  // Tax (2)
  { description: 'GST filing Q3',                               type: 'expense', category: 'Tax', amount: randomAmount(8000, 16000) },
  { description: 'Corporate tax advance',                       type: 'expense', category: 'Tax', amount: randomAmount(12000, 24000) },
  // Office & Admin (2)
  { description: 'Office supplies',                             type: 'expense', category: 'Office & Admin', amount: randomAmount(800, 2000) },
  { description: 'Team offsite - Bangalore',                    type: 'expense', category: 'Office & Admin', amount: randomAmount(3000, 6000) },
];

export function seedIfEmpty() {
  const existing = getTransactions();
  if (existing.length > 0) return;

  const transactions = seedData.map((item, index) => ({
    id: uuid(),
    date: randomDate(Math.floor(index * 6 / seedData.length)),
    description: item.description,
    amount: item.amount,
    type: item.type,
    category: item.category,
    note: '',
    createdAt: new Date().toISOString(),
  }));

  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  setTransactions(transactions);
}
