import React from "react";

type GalleryProps = {
	images?: Array<{
		id: string;
		webformatURL: string;
		tags: string;
		user: string;
		// Add more properties as needed
	}>;
	title?: string;
};

export default function Gallery({ images = [], title }: GalleryProps) {
	return (
		<div className="w-full">
			{title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{images.length > 0 ? (
					images.map((image) => (
						<div
							key={image.id}
							className="rounded-lg overflow-hidden shadow-md"
						>
							{/* Image cards will be rendered here */}
							<div className="aspect-w-16 aspect-h-9 bg-gray-200">
								{/* Placeholder for ImageCard component */}
							</div>
						</div>
					))
				) : (
					<div className="col-span-full text-center py-12">
						<p className="text-gray-500">No images found</p>
					</div>
				)}
			</div>
		</div>
	);
}
