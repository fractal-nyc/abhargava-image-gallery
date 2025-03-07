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
	<div className="flex items-center justify-center">
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

	return (
		<div className="w-full">
			<Suspense
				fallback={
					<div className="w-full h-screen flex justify-center items-center">
						<LoadingSpinner />
					</div>
				}
			>
				{children}
			</Suspense>

			<div
				ref={observerRef}
				className="w-full h-10 flex justify-center items-center my-4"
			>
				{(loading || loadingMore) && hasMore && <LoadingSpinner />}
			</div>
		</div>
	);
}
