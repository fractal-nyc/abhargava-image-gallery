import Link from "next/link";
import { api, HydrateClient } from "~/trpc/server";
import Gallery from "~/app/_components/Gallery";

type ImageType = {
	id: string;
	webformatURL: string;
	tags: string;
	user: string;
};

export default async function Home() {
	// This will be replaced with actual data fetching later
	const featuredImages: ImageType[] = [];

	return (
		<HydrateClient>
			<main className="min-h-screen bg-gray-50">
				<div className="container mx-auto px-4 py-16">
					{/* Hero Section */}
					<div className="text-center mb-12">
						<h1 className="text-4xl md:text-5xl font-bold mb-4">
							Discover Amazing Free Images
						</h1>
						<p className="text-xl text-gray-600 mb-8">
							High quality stock photos powered by Pixabay API
						</p>

						{/* Search Bar */}
						<div className="max-w-3xl mx-auto">
							<form
								action="/search"
								method="GET"
								className="flex flex-col sm:flex-row gap-2"
							>
								<input
									type="text"
									name="q"
									placeholder="Search for images..."
									className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
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

					{/* Categories Section */}
					<div className="mb-12">
						<h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
							{[
								"nature",
								"animals",
								"food",
								"travel",
								"business",
								"technology",
								"people",
								"architecture",
								"sports",
								"education",
								"health",
								"fashion",
							].map((category) => (
								<Link
									key={category}
									href={`/category/${category}`}
									className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow"
								>
									<div className="text-lg capitalize">{category}</div>
								</Link>
							))}
						</div>
					</div>

					{/* Featured Images */}
					<div className="mb-12">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-2xl font-bold">Featured Images</h2>
							<Link href="/search" className="text-blue-600 hover:underline">
								View All
							</Link>
						</div>

						<Gallery images={featuredImages} />

						{featuredImages.length === 0 && (
							<div className="text-center py-12 bg-white rounded-lg shadow-md">
								<p className="text-gray-500">
									Featured images will appear here once implemented
								</p>
							</div>
						)}
					</div>
				</div>
			</main>
		</HydrateClient>
	);
}
