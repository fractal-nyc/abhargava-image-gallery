import { api, HydrateClient } from "~/trpc/server";
import MasonryGallery from "../_components/MasonryGallery";
import Link from "next/link";

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
	const hasMore = searchResults.hasMore;

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

				{/* Search results */}
				<div className="min-h-[50vh]">
					{images.length > 0 ? (
						<>
							<MasonryGallery images={images} />

							{/* Pagination */}
							{(page > 1 || hasMore) && (
								<div className="flex justify-center mt-8 gap-4">
									{page > 1 && (
										<Link
											href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}
											className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
										>
											Previous Page
										</Link>
									)}
									{hasMore && (
										<Link
											href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}
											className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
										>
											Next Page
										</Link>
									)}
								</div>
							)}
						</>
					) : (
						<div className="text-center py-12 bg-white rounded-lg shadow-md">
							<p className="text-gray-500">
								No images found for "{query}". Try a different search term.
							</p>
						</div>
					)}
				</div>
			</div>
		</HydrateClient>
	);
}
