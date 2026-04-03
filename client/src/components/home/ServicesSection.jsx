import { motion } from 'framer-motion';
import { Activity, BarChart2, Shield, Lightbulb, Download, Lock } from 'lucide-react';

const services = [
  { icon: Activity, title: 'Real-time Tracking', desc: 'Monitor every transaction the moment it happens with live dashboard updates.' },
  { icon: BarChart2, title: 'Advanced Analytics', desc: 'Uncover spending patterns, income trends, and category breakdowns at a glance.' },
  { icon: Shield, title: 'Role-Based Access', desc: 'Precisely control who can view, edit, or manage your financial data.' },
  { icon: Lightbulb, title: 'Smart Insights', desc: 'Automated analysis surfaces your top spending, monthly comparisons, and anomalies.' },
  { icon: Download, title: 'Flexible Export', desc: 'Download your data as CSV or JSON — filtered exactly the way you see it.' },
  { icon: Lock, title: 'Secure Storage', desc: 'All data managed client-side with a clean in-memory mock API layer.' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 px-6 bg-black">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary mb-3">
            Everything your finance team needs
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map(s => (
            <motion.div
              key={s.title}
              variants={item}
              className="rounded-xl border border-border bg-surface p-6 hover:border-accent/30 hover:bg-surface-2 transition-colors duration-200"
            >
              <div className="p-2 bg-accent-subtle rounded-lg w-fit mb-4">
                <s.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-base font-semibold text-text-primary mb-2">{s.title}</h3>
              <p className="text-sm text-text-secondary">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
