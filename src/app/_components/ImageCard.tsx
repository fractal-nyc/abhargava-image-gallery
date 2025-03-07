"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type ImageCardProps = {
	id: string;
	imageUrl: string;
	tags: string;
	user: string;
	// Add more properties as needed
};

export default function ImageCard({
	id,
	imageUrl,
	tags,
	user,
}: ImageCardProps) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<Link href={`/images/${id}`}>
			<div
				className="relative overflow-hidden rounded-lg transition-all duration-300 ease-in-out"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<div className="aspect-w-16 aspect-h-9 bg-gray-200">
					{/* Image placeholder - will be replaced with actual image */}
					<div className="w-full h-full bg-gray-200 animate-pulse" />
				</div>

				{isHovered && (
					<div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-end p-4 text-white transition-opacity duration-300">
						<p className="text-sm font-medium truncate">{tags}</p>
						<p className="text-xs opacity-80">by {user}</p>
					</div>
				)}
			</div>
		</Link>
	);
}
