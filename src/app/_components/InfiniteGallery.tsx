"use client";

import { useState, useCallback } from "react";
import MasonryGallery from "./MasonryGallery";
import InfiniteScroll from "./InfiniteScroll";
import SuperJSON from "superjson";

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

interface InfiniteGalleryProps {
	initialImages: ImageType[];
}

export default function InfiniteGallery({
	initialImages,
}: InfiniteGalleryProps) {
	const [images, setImages] = useState<ImageType[]>(initialImages);
	const [page, setPage] = useState(1);
	const [hasMoreImages, setHasMoreImages] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	// Function to load more images
	const loadMore = useCallback(async () => {
		if (isLoadingMore) return;

		try {
			setIsLoadingMore(true);
			const nextPage = page + 1;

			// Fetch the next page of images
			const input = { count: 50, page: nextPage };
			const queryString = encodeURIComponent(SuperJSON.stringify(input));
			const result = await fetch(
				`/api/trpc/pixabay.getFeaturedImages?batch=1&input=${queryString}`,
			);

			const data = await result.json();
			const responseData = data[0].result.data;

			// Update state with new images
			if (responseData.images && responseData.images.length > 0) {
				setImages((prev) => [
					...prev,
					...(responseData.images as unknown as ImageType[]),
				]);
				setPage(nextPage);
				setHasMoreImages(responseData.hasMore);
			} else {
				setHasMoreImages(false);
			}
		} catch (error) {
			console.error("Error loading more images:", error);
			setHasMoreImages(false);
		} finally {
			setIsLoadingMore(false);
		}
	}, [page, isLoadingMore]);

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
