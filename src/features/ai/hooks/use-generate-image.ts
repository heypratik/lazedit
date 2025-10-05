import { useMutation } from "@tanstack/react-query";

interface GenerateImageRequest {
  prompt: string;
}

interface GenerateImageResponse {
  data: string;
}

export const useGenerateImage = () => {
  const mutation = useMutation<
    GenerateImageResponse,
    Error,
    GenerateImageRequest
  >({
    mutationFn: async (requestData) => {
      const response = await fetch("/api/ai/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate image");
      }

      return await response.json();
    },
  });

  return mutation;
};
