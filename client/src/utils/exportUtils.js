function triggerDownload(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportToCSV(transactions, filename = 'aureus-export') {
  const headers = ['ID', 'Date', 'Description', 'Amount', 'Type', 'Category', 'Note', 'Created At'];
  const rows = transactions.map(t => [
    t.id,
    t.date,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    t.amount,
    t.type,
    t.category,
    `"${(t.note || '').replace(/"/g, '""')}"`,
    t.createdAt || '',
  ]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  triggerDownload(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
}

export function exportToJSON(transactions, filename = 'aureus-export') {
  const json = JSON.stringify(transactions, null, 2);
  triggerDownload(json, `${filename}.json`, 'application/json');
}
