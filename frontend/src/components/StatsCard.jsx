const StatsCard = ({ icon, label, value, subtext, gradient }) => {
    return (
        <div className={`relative overflow-hidden rounded-2xl p-6 ${gradient || 'bg-gradient-to-br from-indigo-600 to-purple-600'} shadow-lg`}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-8 translate-x-8" />
            <div className="relative">
                <div className="text-3xl mb-3">{icon}</div>
                <div className="text-3xl font-bold text-white mb-1">{value}</div>
                <div className="text-white/80 text-sm font-medium">{label}</div>
                {subtext && <div className="text-white/60 text-xs mt-1">{subtext}</div>}
            </div>
        </div>
    );
};

export default StatsCard;
