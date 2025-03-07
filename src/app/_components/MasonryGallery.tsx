"use client";

import { Box, Paper } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import { useState, useEffect } from "react";

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

const Label = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(0.5),
	textAlign: "center",
	color: theme.palette.text.secondary,
	borderBottomLeftRadius: 0,
	borderBottomRightRadius: 0,
}));

interface MasonryGalleryProps {
	images: ImageType[];
}

function MasonryGallery({ images }: MasonryGalleryProps) {
	// Add client-side only rendering to prevent hydration mismatch
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) {
		return (
			<div className="text-center py-12 bg-white rounded-lg shadow-md">
				<p className="text-gray-500">Loading images...</p>
			</div>
		);
	}

	if (images.length === 0) {
		return (
			<div className="text-center py-12 bg-white rounded-lg shadow-md">
				<p className="text-gray-500">Loading images...</p>
			</div>
		);
	}

	return (
		<Box sx={{ width: "100%" }}>
			<Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={3}>
				{images.map((image) => (
					<div
						key={image.id}
						className="mb-3 overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
					>
						<Label
							sx={{
								display: "flex",
								justifyContent: "space-between",
								padding: "8px 12px",
							}}
						>
							<span>{image.tags.split(",")[0]}</span>
							<span className="text-xs">by {image.user}</span>
						</Label>
						<Link href={`/images/${image.id}`}>
							<img
								src={image.webformatURL}
								alt={image.tags}
								loading="lazy"
								style={{
									borderBottomLeftRadius: 4,
									borderBottomRightRadius: 4,
									display: "block",
									width: "100%",
								}}
							/>
							<div className="p-2 text-sm text-gray-600 flex justify-between">
								<span>❤️ {image.likes}</span>
								<span>👁️ {image.views}</span>
							</div>
						</Link>
					</div>
				))}
			</Masonry>
		</Box>
	);
}

export default MasonryGallery;
