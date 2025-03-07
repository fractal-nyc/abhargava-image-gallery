import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Define the image type from Pixabay API
const PixabayImageSchema = z.object({
  id: z.number(),
  pageURL: z.string(),
  type: z.string(),
  tags: z.string(),
  previewURL: z.string(),
  previewWidth: z.number(),
  previewHeight: z.number(),
  webformatURL: z.string(),
  webformatWidth: z.number(),
  webformatHeight: z.number(),
  largeImageURL: z.string(),
  imageWidth: z.number(),
  imageHeight: z.number(),
  imageSize: z.number(),
  views: z.number(),
  downloads: z.number(),
  likes: z.number(),
  comments: z.number(),
  user_id: z.number(),
  user: z.string(),
  userImageURL: z.string(),
});

export type PixabayImage = z.infer<typeof PixabayImageSchema>;

// Define the response type from Pixabay API
const PixabayResponseSchema = z.object({
  total: z.number(),
  totalHits: z.number(),
  hits: z.array(PixabayImageSchema),
});

export const pixabayRouter = createTRPCRouter({
  // Search images
  searchImages: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
        page: z.number().default(1),
        perPage: z.number().default(20),
        category: z.string().optional(),
        // Add more parameters as needed
      })
    )
    .query(async ({ input }) => {
      // This will be implemented later
      return {
        images: [],
        total: 0,
        totalHits: 0,
        hasMore: false,
      };
    }),

  // Get image by ID
  getImageById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // This will be implemented later
      return null;
    }),

  // Get images by category
  getImagesByCategory: publicProcedure
    .input(
      z.object({
        category: z.string(),
        page: z.number().default(1),
        perPage: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      // This will be implemented later
      return {
        images: [],
        total: 0,
        totalHits: 0,
        hasMore: false,
      };
    }),

  // Get featured images
  getFeaturedImages: publicProcedure
    .input(
      z.object({
        count: z.number().default(8),
      })
    )
    .query(async ({ input }) => {
      // This will be implemented later
      return {
        images: [],
      };
    }),
}); 