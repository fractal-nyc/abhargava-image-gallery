"use client";

import Image from "next/image";
import { api } from "~/trpc/react";

// Simple interface - just a string ID
interface ImageDetailsProps {
	id: string;
}

export function ImageDetails({ id }: ImageDetailsProps) {
	const {
		data: image,
		isLoading,
		error,
	} = api.pixabay.getImageById.useQuery({ id });

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-full">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-red-500 text-center">
				<p>Error loading image: {error.message}</p>
			</div>
		);
	}

	if (!image) {
		return <div className="text-gray-500 text-center">Image not found</div>;
	}

	// Default image for fallback
	const placeholderImage =
		"https://via.placeholder.com/800x600?text=No+Image+Available";

	return (
		<div className="flex flex-col md:flex-row gap-8">
			<div className="md:w-2/3">
				<div className="relative h-[400px] w-full rounded-lg overflow-hidden">
					<Image
						src={image.largeImageURL || placeholderImage}
						alt={image.tags || "Image"}
						fill
						className="object-contain"
						sizes="(max-width: 768px) 100vw, 66vw"
					/>
				</div>
			</div>
			<div className="md:w-1/3">
				<h2 className="text-xl font-semibold mb-4">Image Information</h2>
				<div className="space-y-3">
					<p>
						<span className="font-medium">Tags:</span> {image.tags || "No tags"}
					</p>
					<p>
						<span className="font-medium">Type:</span> {image.type || "Unknown"}
					</p>
					<p>
						<span className="font-medium">Dimensions:</span>{" "}
						{image.imageWidth || 0} x {image.imageHeight || 0}
					</p>
					<p>
						<span className="font-medium">Views:</span>{" "}
						{(image.views || 0).toLocaleString()}
					</p>
					<p>
						<span className="font-medium">Downloads:</span>{" "}
						{(image.downloads || 0).toLocaleString()}
					</p>
					<p>
						<span className="font-medium">Likes:</span>{" "}
						{(image.likes || 0).toLocaleString()}
					</p>
					<p>
						<span className="font-medium">Comments:</span>{" "}
						{(image.comments || 0).toLocaleString()}
					</p>
				</div>
				<div className="mt-6">
					<h3 className="text-lg font-semibold mb-2">Photographer</h3>
					<div className="flex items-center gap-3">
						{image.userImageURL ? (
							<Image
								src={image.userImageURL}
								alt={image.user || "Photographer"}
								width={40}
								height={40}
								className="rounded-full"
							/>
						) : (
							<div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
								<span className="text-gray-500 text-xs">No pic</span>
							</div>
						)}
						<span>{image.user || "Unknown"}</span>
					</div>
				</div>
				{image.pageURL && (
					<a
						href={image.pageURL}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
					>
						View on Pixabay
					</a>
				)}
			</div>
		</div>
	);
}
