import { api, HydrateClient } from "~/trpc/server";
import Link from "next/link";
import EnhancedInfiniteGallery from "../_components/InfiniteGallery";
import { Suspense } from "react";

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

// Generate unique IDs for placeholders
const generatePlaceholderId = () =>
	`search-placeholder-${Math.random().toString(36).substring(2, 9)}`;

// Loading placeholder
const LoadingPlaceholder = () => {
	// Pre-generate IDs for placeholders
	const placeholderIds = Array.from({ length: 12 }, () =>
		generatePlaceholderId(),
	);

	return (
		<div className="w-full">
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{placeholderIds.map((id) => (
					<div key={id} className="rounded-lg overflow-hidden shadow-md">
						<div className="h-6 bg-gray-200 animate-pulse mb-2" />
						<div className="h-48 bg-gray-300 animate-pulse" />
						<div className="h-6 bg-gray-200 animate-pulse mt-2" />
					</div>
				))}
			</div>
		</div>
	);
};

export default async function SearchPage({
	searchParams,
}: {
	searchParams: { q?: string; page?: string };
}) {
	// Get search query from URL parameters
	const query = searchParams.q || "";
	const page = Number.parseInt(searchParams.page || "1", 10);
	const perPage = 48; // Number of images per page

	// Fetch search results
	const searchResults = await api.pixabay.searchImages({
		query,
		page,
		perPage,
		safeSearch: true,
	});

	const images = searchResults.images as unknown as ImageType[];
	const totalHits = searchResults.totalHits;

	return (
		<HydrateClient>
			<div className="container mx-auto py-8 px-4">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">
						{query ? `Search Results for "${query}"` : "All Images"}
					</h1>
					<Link
						href="/"
						className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
					>
						Back to Home
					</Link>
				</div>

				{/* Search stats */}
				<p className="text-gray-600 mb-6">
					Found {totalHits} {totalHits === 1 ? "image" : "images"}
				</p>

				{/* Search results with infinite scrolling */}
				<div className="min-h-[50vh]">
					{images.length > 0 ? (
						<Suspense fallback={<LoadingPlaceholder />}>
							<EnhancedInfiniteGallery
								initialImages={images}
								searchQuery={query}
							/>
						</Suspense>
					) : (
						<div className="text-center py-12">
							<p className="text-xl text-gray-600">
								No images found for "{query}"
							</p>
							<p className="mt-2 text-gray-500">Try a different search term</p>
						</div>
					)}
				</div>
			</div>
		</HydrateClient>
	);
}
