
export const LoadingSpinner = ({ size = 'md', fullPage = false }) => {
    const sizes = { sm: 'w-6 h-6 border-2', md: 'w-10 h-10 border-4', lg: 'w-16 h-16 border-4' };

    const spinner = (
        <div className={`${sizes[size]} border-indigo-500 border-t-transparent rounded-full animate-spin`} />
    );

    if (fullPage) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] gap-4">
                {spinner}
                <p className="text-[#94a3b8] text-sm animate-pulse">Loading...</p>
            </div>
        );
    }

    return <div className="flex justify-center py-16">{spinner}</div>;
};


export const ErrorMessage = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-3xl">
            ⚠️
        </div>
        <div className="text-center">
            <p className="text-white font-semibold">Something went wrong</p>
            <p className="text-[#94a3b8] text-sm mt-1">{message || 'Failed to load data. Please try again.'}</p>
        </div>
        {onRetry && (
            <button
                onClick={onRetry}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-all"
            >
                🔄 Retry
            </button>
        )}
    </div>
);


export const EmptyState = ({ icon = '📭', title, subtitle, action }) => (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="text-5xl">{icon}</div>
        <div className="text-center">
            <p className="text-white font-semibold">{title}</p>
            {subtitle && <p className="text-[#94a3b8] text-sm mt-1">{subtitle}</p>}
        </div>
        {action}
    </div>
);
