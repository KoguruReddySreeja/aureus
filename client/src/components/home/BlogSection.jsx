import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const posts = [
  {
    title: 'Why most finance dashboards fail their users',
    tag: 'Design',
    date: 'January 15, 2025',
    readTime: '5 min',
    body: `Most finance dashboards are built by engineers who prioritize data density over clarity. They cram every metric onto a single screen, creating visual noise that overwhelms rather than informs.\n\nThe first failure is role confusion. When a dashboard shows the same interface to a CFO and an intern, it serves neither well. The CFO needs high-level trends and anomaly detection. The intern needs transaction-level detail and search. Forcing both into one view creates cognitive overload for one and information scarcity for the other.\n\nThe second failure is poor color choices. Financial dashboards love to use garish reds and greens — colors that are indistinguishable to 8% of men with color vision deficiency. Charts become unreadable, and critical signals get lost in a sea of clashing hues.\n\nThe right approach starts with role-based views, curated color palettes with sufficient contrast, progressive disclosure of detail, and whitespace as a design element rather than wasted space.\n\nAureus was built to fix exactly these problems.`,
  },
  {
    title: 'Designing for data density: lessons from fintech',
    tag: 'Engineering',
    date: 'February 3, 2025',
    readTime: '4 min',
    body: `The challenge of financial interfaces is showing large amounts of data without overwhelming users. Every number competes for attention, and without careful design, the most important signals drown in noise.\n\nFont choice matters more than most designers realize. Monospace fonts for numbers create visual alignment that makes scanning columns effortless. Proportional fonts for labels and descriptions maintain readability. This dual-font approach — which GitHub's design system pioneered — lets you pack more information into less space while keeping it scannable.\n\nProgressive disclosure is your best friend. Show summary metrics at the top level, let users drill into detail on demand. Don't show 40 transactions when 5 recent ones tell the story. Don't show 10 chart types when 3 answer 90% of questions.\n\nWhitespace isn't empty space — it's breathing room. The dark UI aesthetic that GitHub popularized works brilliantly for data-heavy applications because it reduces eye strain during long sessions and makes accent colors pop against the dark canvas.\n\nThese principles shaped every pixel of Aureus's design system.`,
  },
  {
    title: 'Role-based access in B2B SaaS: a practical guide',
    tag: 'Product',
    date: 'March 10, 2025',
    readTime: '6 min',
    body: `Role-based access control matters in financial tools because the cost of unauthorized changes is high — a misclassified transaction, a deleted record, or an exposed salary figure can create real business problems.\n\nBut here's the thing: at the MVP stage, most teams over-engineer RBAC. They build elaborate permission matrices with server-side enforcement, JWT claims for every action, and admin panels for role management — before they even have 10 customers.\n\nFrontend-level role simulation is a pragmatic middle ground for demos and early-stage products. Store the role in localStorage, conditionally render UI elements, and let the backend trust the client for now. This approach lets you validate the role UX with real users before investing in server-side enforcement.\n\nThe key is knowing when to upgrade. Once you have paying customers with sensitive data, server-side enforcement becomes non-negotiable. The frontend role system becomes a UX layer on top of API-level permissions, not a replacement for them.\n\nAureus demonstrates this pragmatic approach — full role-based UI with frontend simulation, designed to be upgraded to server-side enforcement when the business demands it.`,
  },
];

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15 } },
};

export default function BlogSection() {
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <section id="blog" className="py-24 px-6 bg-black">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary mb-3">
            From the desk of Aureus
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.button
              key={post.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedPost(post)}
              className="text-left rounded-xl border border-border bg-surface p-6 hover:border-elevated-2 hover:bg-surface-2 transition-colors duration-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs bg-accent-subtle text-accent px-2.5 py-0.5 rounded-full font-medium">{post.tag}</span>
                <span className="text-xs text-text-muted">{post.readTime} read</span>
              </div>
              <h3 className="text-base font-semibold text-text-primary mb-2">{post.title}</h3>
              <p className="text-xs text-text-muted">{post.date}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Blog Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setSelectedPost(null)}>
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={e => e.stopPropagation()}
              className="bg-surface border border-border rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs bg-accent-subtle text-accent px-2.5 py-0.5 rounded-full font-medium">{selectedPost.tag}</span>
                    <span className="text-xs text-text-muted">{selectedPost.date}</span>
                    <span className="text-xs text-text-muted">{selectedPost.readTime} read</span>
                  </div>
                  <h2 className="text-xl font-semibold text-text-primary">{selectedPost.title}</h2>
                </div>
                <button onClick={() => setSelectedPost(null)} className="text-text-secondary hover:text-text-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                {selectedPost.body.split('\n\n').map((para, i) => (
                  <p key={i} className="text-sm text-text-secondary leading-relaxed mb-4">{para}</p>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
