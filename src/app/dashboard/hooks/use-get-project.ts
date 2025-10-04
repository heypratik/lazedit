import { useQuery } from "@tanstack/react-query";

export const useGetProject = (id: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["project", { id }],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || window.location.origin;
      const response = await fetch(`${baseUrl}/api/admin/projects?projectId=${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch project");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
