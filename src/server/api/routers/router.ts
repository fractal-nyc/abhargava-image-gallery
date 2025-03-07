import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";
import { TRPCError } from "@trpc/server";

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

// Base URL for Pixabay API
const PIXABAY_API_URL = "https://pixabay.com/api/";

// Helper function to fetch data from Pixabay API
async function fetchFromPixabay(params: Record<string, string | number | boolean | undefined>) {
  // Ensure we have an API key
  if (!env.PIXABAY_API_KEY) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Pixabay API key is not configured",
    });
  }

  // Build query parameters
  const queryParams = new URLSearchParams();
  queryParams.append("key", env.PIXABAY_API_KEY);
  
  // Add all other parameters
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      queryParams.append(key, String(value));
    }
  }

  // Make the request
  try {
    const response = await fetch(`${PIXABAY_API_URL}?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Pixabay API error: ${response.status} ${response.statusText}`,
      });
    }
    
    const data = await response.json();
    return PixabayResponseSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Invalid response from Pixabay API",
        cause: error,
      });
    }
    
    if (error instanceof TRPCError) {
      throw error;
    }
    
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch data from Pixabay API",
      cause: error,
    });
  }
}

export const pixabayRouter = createTRPCRouter({
  // Search images
  searchImages: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
        page: z.number().default(1),
        perPage: z.number().min(3).max(200).default(20),
        category: z.string().optional(),
        imageType: z.enum(["all", "photo", "illustration", "vector"]).default("all"),
        orientation: z.enum(["all", "horizontal", "vertical"]).default("all"),
        order: z.enum(["popular", "latest"]).default("popular"),
        safeSearch: z.boolean().default(true),
      })
    )
    .query(async ({ input }) => {
      const { query, page, perPage, category, imageType, orientation, order, safeSearch } = input;
      
      const response = await fetchFromPixabay({
        q: query,
        page,
        per_page: perPage,
        category,
        image_type: imageType,
        orientation,
        order,
        safesearch: safeSearch,
        lang: "en", // English language only as specified
      });
      
      return {
        images: response.hits.map(hit => ({
          ...hit,
          id: String(hit.id), // Convert to string for consistency with our routes
        })),
        total: response.total,
        totalHits: response.totalHits,
        hasMore: page * perPage < response.totalHits,
      };
    }),

  // Get image by ID
  getImageById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;
      
      const response = await fetchFromPixabay({
        id,
        lang: "en",
      });
      
      if (response.hits.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Image with ID ${id} not found`,
        });
      }
      
      return {
        ...response.hits[0],
        id: String(response.hits[0]?.id), // Convert to string for consistency
      };
    }),

  // Get images by category
  getImagesByCategory: publicProcedure
    .input(
      z.object({
        category: z.string(),
        page: z.number().default(1),
        perPage: z.number().min(3).max(200).default(20),
        imageType: z.enum(["all", "photo", "illustration", "vector"]).default("all"),
        order: z.enum(["popular", "latest"]).default("popular"),
      })
    )
    .query(async ({ input }) => {
      const { category, page, perPage, imageType, order } = input;
      
      const response = await fetchFromPixabay({
        category,
        page,
        per_page: perPage,
        image_type: imageType,
        order,
        safesearch: true,
        lang: "en",
      });
      
      return {
        images: response.hits.map(hit => ({
          ...hit,
          id: String(hit.id), // Convert to string for consistency
        })),
        total: response.total,
        totalHits: response.totalHits,
        hasMore: page * perPage < response.totalHits,
      };
    }),

  // Get featured images (using editor's choice)
  getFeaturedImages: publicProcedure
    .input(
      z.object({
        count: z.number().min(3).max(200).default(8),
        imageType: z.enum(["all", "photo", "illustration", "vector"]).default("photo"),
      })
    )
    .query(async ({ input }) => {
      const { count, imageType } = input;
      
      const response = await fetchFromPixabay({
        editors_choice: true,
        per_page: count,
        image_type: imageType,
        safesearch: true,
        lang: "en",
      });
      
      return {
        images: response.hits.map(hit => ({
          ...hit,
          id: String(hit.id), // Convert to string for consistency
        })),
      };
    }),
    
  // Get random images for homepage
  getRandomImages: publicProcedure
    .input(
      z.object({
        count: z.number().min(3).max(200).default(8),
      })
    )
    .query(async ({ input }) => {
      const { count } = input;
      
      // Get popular images with a random order
      const response = await fetchFromPixabay({
        per_page: count,
        safesearch: true,
        order: "popular",
        lang: "en",
      });
      
      // Shuffle the results for randomness
      const shuffled = [...response.hits].sort(() => 0.5 - Math.random());
      
      return {
        images: shuffled.slice(0, count).map(hit => ({
          ...hit,
          id: String(hit.id), // Convert to string for consistency
        })),
      };
    }),
}); 