"use client";

import { DataTable } from "./data-table";
import CustomLayout from "../layout/layout";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import crypto from "crypto-js";

function encryptApiKey(apiKey) {
  const nonce = Date.now().toString(); // Could also use crypto.randomBytes
  const apiKeyWithNonce = `${nonce}:${apiKey}`;
  const encrypted = crypto.AES.encrypt(
    apiKeyWithNonce,
    process.env.NEXT_PUBLIC_SECRET
  ).toString();
  return { encrypted, nonce };
}

export default function Segments({ session, storeId, store }) {
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const queryClient = useQueryClient();
  const { encrypted, nonce } = encryptApiKey(store?.klaviyoKey);

  // Fetch segments data
  const { data: segmentsData } = useQuery({
    queryKey: ["segments", storeId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/segments?store=${storeId}`);
      const result = await response.json();
      setData(result.data);
      return result.data;
    },
  });

  // Create Klaviyo list mutation
  const createKlaviyoList = useMutation({
    mutationFn: async (payload) => {
      const response = await fetch("/api/klaviyo/create-list", {
        method: "POST",
        headers: {
          Authorization: `${encrypted}`,
          Xauth: `${nonce}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create Klaviyo list");
      }

      return response.json();
    },
    onSuccess: () => {
      // Optionally invalidate queries or update UI
      queryClient.invalidateQueries({ queryKey: ["segments"] });
      // Reset selected ID
      setSelectedId(null);
    },
  });

  const handleAddToKlaviyo = () => {
    if (!selectedId) return;

    // Find the cluster name from the data array
    const selectedCluster = data.find((item) => item.clusterId === selectedId);
    if (!selectedCluster) return;

    const payload = {
      clusterId: selectedId,
      clusterName: selectedCluster.clusterName,
      storeId: storeId,
    };

    createKlaviyoList.mutate(payload);
  };

  return (
    <CustomLayout>
      <div className="flex flex-col">
        <div className="flex items-center justify-end mb-4">
          <Button
            className="bg-black"
            disabled={selectedId === null}
            onClick={handleAddToKlaviyo}
            isLoading={createKlaviyoList.isPending}
          >
            {createKlaviyoList.isPending ? "Adding..." : "Add to Klaviyo"}
          </Button>
        </div>
        <DataTable
          data={data}
          setSelectedId={setSelectedId}
          selectedId={selectedId}
        />
      </div>
    </CustomLayout>
  );
}
