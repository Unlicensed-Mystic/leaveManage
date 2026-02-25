const StatusBadge = ({ status }) => {
    const styles = {
        pending: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        approved: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        rejected: 'bg-red-500/20 text-red-400 border border-red-500/30',
    };

    const icons = {
        pending: '⏳',
        approved: '✅',
        rejected: '❌',
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${styles[status] || styles.pending}`}>
            <span>{icons[status]}</span>
            {status}
        </span>
    );
};

export default StatusBadge;
