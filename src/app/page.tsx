import { api, HydrateClient } from "~/trpc/server";
import EnhancedInfiniteGallery from "./_components/EnhancedInfiniteGallery";
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
	`home-placeholder-${Math.random().toString(36).substring(2, 9)}`;

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

export default async function Home() {
	// Fetch featured images
	const featuredData = await api.pixabay.getFeaturedImages({
		count: 20,
		page: 1,
	});
	const featuredImages = featuredData.images as unknown as ImageType[];

	return (
		<HydrateClient>
			<main className="min-h-screen bg-gray-50">
				<div className="container mx-auto px-4 py-8">
					{/* Hero Section */}
					<div className="text-center mb-8">
						{/* Search Bar */}
						<div className="max-w-3xl mx-auto mb-10 fixed top-4 left-0 right-0 z-20 shadow-lg">
							<form
								action="/search"
								method="GET"
								className="flex flex-col sm:flex-row gap-2 bg-white/95 backdrop-blur-sm p-3 rounded-xl"
							>
								<input
									type="text"
									name="q"
									placeholder="Search for images..."
									className="flex-grow px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
								/>
								<button
									type="submit"
									className="px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors"
								>
									Search
								</button>
							</form>
						</div>
					</div>

					{/* Add spacing between search and gallery */}
					<div className="pt-24 md:pt-28" />

					{/* Masonry Image Gallery with Infinite Scroll */}
					<div className="px-2">
						<Suspense fallback={<LoadingPlaceholder />}>
							<EnhancedInfiniteGallery initialImages={featuredImages} />
						</Suspense>
					</div>
				</div>
			</main>
		</HydrateClient>
	);
}
