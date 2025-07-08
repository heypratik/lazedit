import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateProject = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    any,
    Error
    >({
    mutationKey: ["project", { id }],
    mutationFn: async (values) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/projects/patch`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        // @ts-ignore
        body: JSON.stringify({ id: id, json: values.json, height: values.height, width: values.width }),
      });

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", { id }] });
    },
    onError: () => {
      toast.error("Failed to update project");
    }
  });

  return mutation;
};
