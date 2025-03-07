import { api, HydrateClient } from "~/trpc/server";
import Link from "next/link";
import InfiniteGallery from "../_components/InfiniteGallery";

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
						<InfiniteGallery initialImages={images} searchQuery={query} />
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
