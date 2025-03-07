import React from "react";
import Image from "next/image";
import Link from "next/link";

type ImageDetailProps = {
	image: {
		id: string;
		largeImageURL: string;
		webformatURL: string;
		tags: string;
		user: string;
		views: number;
		downloads: number;
		likes: number;
		comments: number;
		// Add more properties as needed
	};
};

export default function ImageDetail({ image }: ImageDetailProps) {
	const tagList = image.tags.split(",").map((tag) => tag.trim());

	return (
		<div className="bg-white rounded-lg shadow-lg overflow-hidden">
			<div className="relative aspect-video w-full">
				{/* Image placeholder - will be replaced with actual image */}
				<div className="w-full h-full bg-gray-200" />
			</div>

			<div className="p-6">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold">Image by {image.user}</h2>
					<div className="text-sm text-gray-500">ID: {image.id}</div>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
					<div className="text-center">
						<div className="text-xl font-bold">
							{image.views.toLocaleString()}
						</div>
						<div className="text-sm text-gray-500">Views</div>
					</div>
					<div className="text-center">
						<div className="text-xl font-bold">
							{image.downloads.toLocaleString()}
						</div>
						<div className="text-sm text-gray-500">Downloads</div>
					</div>
					<div className="text-center">
						<div className="text-xl font-bold">
							{image.likes.toLocaleString()}
						</div>
						<div className="text-sm text-gray-500">Likes</div>
					</div>
					<div className="text-center">
						<div className="text-xl font-bold">
							{image.comments.toLocaleString()}
						</div>
						<div className="text-sm text-gray-500">Comments</div>
					</div>
				</div>

				<div className="mb-6">
					<h3 className="text-lg font-semibold mb-2">Tags</h3>
					<div className="flex flex-wrap gap-2">
						{tagList.map((tag) => (
							<Link
								key={`tag-${tag}`}
								href={`/search?q=${encodeURIComponent(tag)}`}
								className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
							>
								{tag}
							</Link>
						))}
					</div>
				</div>

				<div className="flex justify-between">
					<Link
						href={image.largeImageURL}
						target="_blank"
						rel="noopener noreferrer"
						className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
					>
						View Original
					</Link>

					<Link
						href="/"
						className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
					>
						Back to Gallery
					</Link>
				</div>
			</div>
		</div>
	);
}
