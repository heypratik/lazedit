import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.ai["edit-image"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.ai["edit-image"]["$post"]>["json"];

export const useEditImage = () => {
  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.ai["edit-image"].$post({ json });
      return await response.json();
    },
  });

  return mutation;
};