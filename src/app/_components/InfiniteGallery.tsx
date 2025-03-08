"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import MasonryGallery from "./MasonryGallery";
import InfiniteScroll from "./InfiniteScroll";
import { api } from "~/trpc/react";

type ImageType = {
	id: string;
	webformatURL: string;
	tags: string;
	user: string;
	views: number;
	downloads: number;
	likes: number;
	largeImageURL: string;
};

// Define a type for the API response
type ImageResponse = {
	images: {
		id: string | number;
		webformatURL: string;
		tags: string;
		user: string;
		views: number;
		downloads: number;
		likes: number;
		largeImageURL: string;
		[key: string]: unknown;
	}[];
	hasMore: boolean;
	total?: number;
	totalHits?: number;
};

// Generate unique IDs for placeholders
const generatePlaceholderId = () =>
	`placeholder-${Math.random().toString(36).substring(2, 9)}`;

// Loading placeholder for the gallery
const GalleryPlaceholder = () => {
	// Pre-generate IDs for placeholders
	const placeholderIds = Array.from({ length: 12 }, () =>
		generatePlaceholderId(),
	);

	return (
		<div className="w-full min-h-[500px]">
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{placeholderIds.map((id) => (
					<div key={id} className="rounded-lg overflow-hidden shadow-md">
						<div className="h-6 bg-gray-200 animate-pulse mb-2" />
						<div className="aspect-[4/3] bg-gray-300 animate-pulse" />
						<div className="h-6 bg-gray-200 animate-pulse mt-2" />
					</div>
				))}
			</div>
		</div>
	);
};

interface EnhancedInfiniteGalleryProps {
	initialImages: ImageType[];
	searchQuery?: string;
}

export default function EnhancedInfiniteGallery({
	initialImages,
	searchQuery,
}: EnhancedInfiniteGalleryProps) {
	const [images, setImages] = useState<ImageType[]>(initialImages);
	const [page, setPage] = useState(1);
	const [hasMoreImages, setHasMoreImages] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [isInitialLoad, setIsInitialLoad] = useState(true);

	// Set initial load to false after component mounts
	useEffect(() => {
		// Use a short timeout to allow the browser to calculate layout
		const timer = setTimeout(() => {
			setIsInitialLoad(false);
		}, 200);

		return () => clearTimeout(timer);
	}, []);

	// Determine which query to use based on whether we have a search query
	const featuredImagesQuery = api.pixabay.getFeaturedImages.useQuery(
		{
			count: 50,
			page: page + 1,
		},
		{
			enabled: !searchQuery && hasMoreImages,
		},
	);

	const searchImagesQuery = api.pixabay.searchImages.useQuery(
		{
			query: searchQuery || "",
			page: page + 1,
			perPage: 50,
		},
		{
			enabled: !!searchQuery && hasMoreImages,
		},
	);

	// Prefetch next page when current page changes
	useEffect(() => {
		if (hasMoreImages && !isLoadingMore) {
			if (searchQuery) {
				void searchImagesQuery.refetch();
			} else {
				void featuredImagesQuery.refetch();
			}
		}
	}, [
		searchQuery,
		hasMoreImages,
		isLoadingMore,
		searchImagesQuery,
		featuredImagesQuery,
	]);

	// Function to load more images
	const loadMore = useCallback(async () => {
		if (isLoadingMore) return;

		try {
			setIsLoadingMore(true);
			const nextPage = page + 1;

			let response: ImageResponse | undefined;

			// Use the appropriate query based on whether we have a search query
			if (searchQuery) {
				const result = await searchImagesQuery.refetch();
				response = result.data;
			} else {
				const result = await featuredImagesQuery.refetch();
				response = result.data;
			}

			// Update state with new images
			if (response?.images && response.images.length > 0) {
				// Use a callback to ensure we're working with the latest state
				setImages((prev) => {
					// Create a Set of existing IDs to avoid duplicates
					const existingIds = new Set(prev.map((img) => img.id));

					// Filter out any duplicates from the new images
					const newImages = response.images.filter(
						(img) => !existingIds.has(img.id as string),
					) as unknown as ImageType[];

					return [...prev, ...newImages];
				});

				setPage(nextPage);
				setHasMoreImages(response.hasMore);
			} else {
				setHasMoreImages(false);
			}
		} catch (error) {
			setHasMoreImages(false);
		} finally {
			setIsLoadingMore(false);
		}
	}, [
		page,
		isLoadingMore,
		searchQuery,
		featuredImagesQuery,
		searchImagesQuery,
	]);

	return (
		<InfiniteScroll
			loadMore={loadMore}
			hasMore={hasMoreImages}
			loading={isLoadingMore}
		>
			{isInitialLoad ? (
				<GalleryPlaceholder />
			) : (
				<Suspense fallback={<GalleryPlaceholder />}>
					<MasonryGallery images={images} />
				</Suspense>
			)}
		</InfiniteScroll>
	);
}
