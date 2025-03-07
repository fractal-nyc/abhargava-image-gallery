import Link from "next/link";
import { ImageDetails } from "~/app/_components/ImageDetails";

type ImageDetailPageProps = {
	params: {
		id: string;
	};
};

export default function ImageDetailPage({ params }: ImageDetailPageProps) {
	const { id } = params;

	return (
		<div className="container mx-auto py-8">
			<div className="mb-6 flex items-center">
				<Link
					href="/"
					className="mr-4 flex items-center rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition-colors"
				>
					<svg
						aria-label="Back to Gallery"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5 mr-2"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
							clipRule="evenodd"
						/>
					</svg>
					Back to Gallery
				</Link>
				<h1 className="text-3xl font-bold">Image Details</h1>
			</div>
			<div className="bg-white rounded-lg shadow-md p-6">
				<p className="text-gray-700 mb-4">Image ID: {id}</p>
				<div className="min-h-[50vh] overflow-hidden">
					<ImageDetails id={id} />
				</div>
			</div>
		</div>
	);
}
