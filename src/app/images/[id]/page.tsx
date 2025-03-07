type ImageDetailPageProps = {
	params: {
		id: string;
	};
};

export default function ImageDetailPage({ params }: ImageDetailPageProps) {
	const { id } = params;

	return (
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-6">Image Details</h1>
			<div className="bg-white rounded-lg shadow-md p-6">
				<p className="text-gray-700 mb-4">Image ID: {id}</p>
				<div className="min-h-[50vh]">
					{/* Image details will be displayed here */}
				</div>
			</div>
		</div>
	);
}
