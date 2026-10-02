export const formatSalary = (min, max) => {
  if (!min && !max) return 'Competitive';
  const formatNum = (num) => {
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}k`;
    return `$${num}`;
  };
  if (min && max) return `${formatNum(min)} - ${formatNum(max)} / yr`;
  if (min) return `From ${formatNum(min)} / yr`;
  return `Up to ${formatNum(max)} / yr`;
};

export const formatDateAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const getStatusBadgeStyle = (status) => {
  switch (status?.toLowerCase()) {
    case 'applied':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'shortlisted':
      return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    case 'hired':
      return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    case 'rejected':
      return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
    case 'open':
      return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    case 'closed':
      return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
    default:
      return 'bg-slate-700 text-slate-300 border border-slate-600';
  }
};
