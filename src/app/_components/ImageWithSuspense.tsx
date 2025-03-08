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

// Image placeholder component with aspect ratio preservation
export const ImagePlaceholder = () => (
	<div className="animate-pulse bg-gray-200 w-full aspect-[4/3] rounded-b-lg" />
);

// Image component with loading state
export const ImageWithSuspense = ({ image }: { image: ImageType }) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const [error, setError] = useState(false);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	// Preload the image and get its dimensions
	useEffect(() => {
		const img = new Image();
		img.src = image.webformatURL;

		img.onload = () => {
			setDimensions({
				width: img.width,
				height: img.height,
			});
			setIsLoaded(true);
		};

		img.onerror = () => setError(true);

		return () => {
			img.onload = null;
			img.onerror = null;
		};
	}, [image.webformatURL]);

	if (error) {
		return (
			<div className="bg-gray-100 w-full aspect-[4/3] rounded-b-lg flex items-center justify-center">
				<span className="text-gray-500">Failed to load image</span>
			</div>
		);
	}

	// Calculate aspect ratio for the container
	const aspectRatio =
		dimensions.height > 0 ? dimensions.width / dimensions.height : 4 / 3;

	return (
		<div
			className="relative"
			style={{
				aspectRatio: aspectRatio,
				width: "100%",
			}}
		>
			{!isLoaded && <ImagePlaceholder />}
			<img
				src={image.webformatURL}
				alt={image.tags}
				style={{
					borderBottomLeftRadius: 4,
					borderBottomRightRadius: 4,
					display: "block",
					width: "100%",
					height: "100%",
					objectFit: "cover",
					opacity: isLoaded ? 1 : 0,
					transition: "opacity 0.3s ease-in-out",
					position: isLoaded ? "relative" : "absolute",
					top: 0,
					left: 0,
				}}
			/>
		</div>
	);
};

export default ImageWithSuspense;
