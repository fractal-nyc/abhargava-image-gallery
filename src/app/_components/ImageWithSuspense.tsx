"use client";

import { useState, useEffect } from "react";

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

// Image placeholder component
export const ImagePlaceholder = () => (
	<div className="animate-pulse bg-gray-200 w-full h-48 rounded-b-lg" />
);

// Image component with loading state
export const ImageWithSuspense = ({ image }: { image: ImageType }) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const [error, setError] = useState(false);

	// Preload the image
	useEffect(() => {
		const img = new Image();
		img.src = image.webformatURL;
		img.onload = () => setIsLoaded(true);
		img.onerror = () => setError(true);

		return () => {
			img.onload = null;
			img.onerror = null;
		};
	}, [image.webformatURL]);

	if (error) {
		return (
			<div className="bg-gray-100 w-full h-48 rounded-b-lg flex items-center justify-center">
				<span className="text-gray-500">Failed to load image</span>
			</div>
		);
	}

	return (
		<div className="relative">
			{!isLoaded && <ImagePlaceholder />}
			<img
				src={image.webformatURL}
				alt={image.tags}
				style={{
					borderBottomLeftRadius: 4,
					borderBottomRightRadius: 4,
					display: "block",
					width: "100%",
					opacity: isLoaded ? 1 : 0,
					transition: "opacity 0.3s ease-in-out",
				}}
			/>
		</div>
	);
};

export default ImageWithSuspense;
