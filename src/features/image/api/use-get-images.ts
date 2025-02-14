import { useQuery } from "@tanstack/react-query";
import {client} from "@/lib/hono"


interface ImageResponse {
    data: any;
  }
  

export const useGetImages = () => {
  const query = useQuery({
    queryKey: ["images"],
    queryFn: async () => {
      const response = await client.api.images.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }

      const {data} = await response.json() as ImageResponse;
      return data;

    }
  })

    return query;
};