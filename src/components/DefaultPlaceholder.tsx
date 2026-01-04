
export function DefaultPlaceholder({ title, className = "" }: { title?: string; className?: string }) {
    return (
        <div className={`w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800/40 relative overflow-hidden ${className}`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--color-indigo-500)_0%,_transparent_25%),radial-gradient(circle_at_70%_60%,_var(--color-purple-500)_0%,_transparent_25%)] opacity-[0.05] dark:opacity-[0.1]" />
            <div className="relative flex flex-col items-center gap-3 opacity-30 select-none">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-[0.2em]">{title || "Blog Image"}</span>
            </div>
        </div>
    );
}
