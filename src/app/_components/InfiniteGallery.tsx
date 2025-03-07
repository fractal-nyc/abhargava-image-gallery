"use client";

import { useState, useCallback, useEffect } from "react";
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

interface InfiniteGalleryProps {
	initialImages: ImageType[];
	searchQuery?: string;
}

export default function InfiniteGallery({
	initialImages,
	searchQuery,
}: InfiniteGalleryProps) {
	const [images, setImages] = useState<ImageType[]>(initialImages);
	const [page, setPage] = useState(1);
	const [hasMoreImages, setHasMoreImages] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

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
			<MasonryGallery images={images} />
		</InfiniteScroll>
	);
}
