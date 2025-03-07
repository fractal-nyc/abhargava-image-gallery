type CategoryPageProps = {
	params: {
		category: string;
	};
};

export default function CategoryPage({ params }: CategoryPageProps) {
	const { category } = params;

	return (
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-6 capitalize">{category} Images</h1>
			<div className="min-h-[50vh]">
				{/* Category images will be displayed here */}
			</div>
		</div>
	);
}
