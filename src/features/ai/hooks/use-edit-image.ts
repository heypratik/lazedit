import { useMutation } from "@tanstack/react-query";

interface EditImageRequest {
  prompt: string;
  input_image: string;
  output_format?: "jpg" | "png" | "webp";
  num_inference_steps?: number;
}

interface EditImageResponse {
  data: string;
}

export const useEditImage = () => {
  const mutation = useMutation<
    EditImageResponse,
    Error,
    EditImageRequest
  >({
    mutationFn: async (requestData) => {
      const response = await fetch("/api/ai/edit-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to edit image");
      }

      return await response.json();
    },
  });

  return mutation;
};