export const CATEGORY_COLORS = {
  'Payroll':        '#2f81f7',
  'SaaS Revenue':   '#10b981',
  'Vendor Payment': '#f59e0b',
  'Infrastructure': '#8b5cf6',
  'Marketing':      '#f97316',
  'Office & Admin': '#0ea5e9',
  'Tax':            '#f43f5e',
  'Consulting':     '#84cc16',
  'Refund':         '#6366f1',
  'Miscellaneous':  '#64748b',
};

export const RECHARTS_DEFAULTS = {
  cartesianGrid: { strokeDasharray: '3 3', stroke: '#1a1a1a' },
  xAxis:  { tick: { fill: '#888888', fontSize: 12, fontFamily: 'Geist Mono' } },
  yAxis:  { tick: { fill: '#888888', fontSize: 12, fontFamily: 'Geist Mono' } },
  tooltip: {
    contentStyle: {
      backgroundColor: '#111111',
      border: '1px solid #2a2a2a',
      borderRadius: '8px',
      color: '#f0f0f0',
      fontSize: '13px',
      fontFamily: 'Geist',
    },
    cursor: { fill: 'rgba(47, 129, 247, 0.05)' },
  },
};
