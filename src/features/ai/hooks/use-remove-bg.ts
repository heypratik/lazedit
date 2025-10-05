import { useMutation } from "@tanstack/react-query";

interface RemoveBgRequest {
  image: string;
}

interface RemoveBgResponse {
  data: string;
}

export const useRemoveBg = () => {
  const mutation = useMutation<
    RemoveBgResponse,
    Error,
    RemoveBgRequest
  >({
    mutationFn: async (requestData) => {
      const response = await fetch("/api/ai/remove-bg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to remove background");
      }

      return await response.json();
    },
  });

  return mutation;
};
