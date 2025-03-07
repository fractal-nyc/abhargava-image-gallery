import { api, HydrateClient } from "~/trpc/server";
import MasonryGallery from "./_components/MasonryGallery";
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

export default async function Home() {
	// Fetch featured images
	const featuredData = await api.pixabay.getFeaturedImages({ count: 24 });
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
								className="flex flex-col sm:flex-row gap-2 bg-white/95 backdrop-blur-sm p-3 rounded-lg"
							>
								<input
									type="text"
									name="q"
									placeholder="Search for images..."
									className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
								/>
								<button
									type="submit"
									className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
								>
									Search
								</button>
							</form>
						</div>
					</div>

					{/* Masonry Image Gallery */}
					<div className="px-2">
						<MasonryGallery images={featuredImages} />
					</div>
				</div>
			</main>
		</HydrateClient>
	);
}
