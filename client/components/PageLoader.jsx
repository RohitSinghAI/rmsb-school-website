"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function SkeletonLoader({ loading }) {
    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
                >
                    <div className="w-full max-w-5xl px-6 space-y-6 animate-pulse">
                        
                        {/* Title */}
                        <div className="h-10 w-1/2 rounded-lg bg-gray-200" />

                        {/* Subtitle */}
                        <div className="h-4 w-1/3 rounded bg-gray-200" />

                        {/* Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="h-56 rounded-2xl bg-gray-200"
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
