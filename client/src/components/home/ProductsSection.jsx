import { motion } from 'framer-motion';

const products = [
  {
    title: 'Dashboard Overview',
    desc: 'Your financial command center. Balance trends, income vs expense charts, spending by category, and recent activity — all on one screen.',
    pills: ['4 Stat Cards', 'Area Chart', 'Donut Chart', 'Recent Transactions'],
  },
  {
    title: 'Transaction Manager',
    desc: 'Full CRUD transaction management. Filter by date, type, category. Sort, group, and export exactly the data you need.',
    pills: ['Advanced Filtering', 'Grouping', 'CSV + JSON Export', 'Admin CRUD'],
  },
  {
    title: 'Insights Engine',
    desc: 'Automated financial intelligence. Top spending categories, month-over-month comparisons, and category breakdowns with visual progress bars.',
    pills: ['Category Breakdown', 'MoM Comparison', 'Spending Ratios', 'Monthly Summaries'],
  },
];

export default function ProductsSection() {
  return (
    <section id="products" className="py-24 px-6 bg-black">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary mb-3">
            One platform. Three powerful views.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-xl border border-border bg-surface p-6 hover:border-elevated-2 hover:bg-surface-2 transition-colors duration-200"
            >
              {/* Mock preview */}
              <div className="rounded-lg bg-elevated border border-border-subtle p-3 mb-5">
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="w-2 h-2 rounded-full bg-danger/60" />
                  <div className="w-2 h-2 rounded-full bg-warning/60" />
                  <div className="w-2 h-2 rounded-full bg-success/60" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-3/4 bg-border rounded" />
                  <div className="h-2 w-1/2 bg-border rounded" />
                  <div className="flex gap-1 mt-2">
                    <div className="h-8 flex-1 bg-accent/10 rounded" />
                    <div className="h-8 flex-1 bg-accent/20 rounded" />
                    <div className="h-8 flex-1 bg-accent/15 rounded" />
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-text-primary mb-2">{p.title}</h3>
              <p className="text-sm text-text-secondary mb-4">{p.desc}</p>
              <div className="flex flex-wrap gap-2">
                {p.pills.map(pill => (
                  <span key={pill} className="text-xs bg-elevated text-text-secondary px-2.5 py-1 rounded-full border border-border">
                    {pill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
