"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import type { ReactNode } from "react";

type InfiniteScrollProps = {
	loadMore: () => Promise<void>;
	hasMore: boolean;
	loading: boolean;
	children: ReactNode;
};

// Loading spinner component
const LoadingSpinner = () => (
	<div className="flex items-center justify-center py-4">
		<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
		<span className="ml-2">Loading more...</span>
	</div>
);

export default function InfiniteScroll({
	loadMore,
	hasMore,
	loading,
	children,
}: InfiniteScrollProps) {
	const [loadingMore, setLoadingMore] = useState(false);
	const observerRef = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			async (entries) => {
				const [entry] = entries;

				if (entry?.isIntersecting && hasMore && !loading && !loadingMore) {
					setLoadingMore(true);
					await loadMore();
					setLoadingMore(false);
				}
			},
			{ threshold: 0.1 },
		);

		const currentObserver = observerRef.current;

		if (currentObserver) {
			observer.observe(currentObserver);
		}

		return () => {
			if (currentObserver) {
				observer.unobserve(currentObserver);
			}
		};
	}, [hasMore, loadMore, loading, loadingMore]);

	// Prevent layout shift by maintaining scroll position when new content loads
	useEffect(() => {
		const container = scrollContainerRef.current;
		if (container && loadingMore) {
			const scrollPosition = window.scrollY;
			const handleScroll = () => {
				if (window.scrollY !== scrollPosition) {
					window.scrollTo(0, scrollPosition);
				}
			};

			window.addEventListener("scroll", handleScroll, { passive: true });

			return () => {
				window.removeEventListener("scroll", handleScroll);
			};
		}
	}, [loadingMore]);

	return (
		<div className="w-full" ref={scrollContainerRef}>
			<div className="min-h-[500px]">{children}</div>

			<div
				ref={observerRef}
				className="w-full h-10 flex justify-center items-center my-4"
				style={{
					minHeight: (loading || loadingMore) && hasMore ? "50px" : "10px",
				}}
			>
				{(loading || loadingMore) && hasMore && <LoadingSpinner />}
			</div>
		</div>
	);
}
