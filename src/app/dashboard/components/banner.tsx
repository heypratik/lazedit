"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import {createProject} from "../actions/project.actions";

import { Button } from "@/components/ui/button";

export const Banner = ({organization, userId}: {
  userId: any
  organization: any
}) => {
  const router = useRouter();
  // const mutation = useCreateProject();

  const onClick = async () => {
    const project = await createProject(organization.id, userId);

    if (project) {
      router.push(`/dashboard/${project.id}`);
    } else {
      console.log("Error creating project");
    }
  };

  return (
    <div className="text-white min-h-[248px] flex gap-x-6 p-6 items-center rounded-0 glass-strong">
      <div className="rounded-full size-28 items-center justify-center bg-white/50 hidden md:flex">
        <div className="rounded-full size-20 flex items-center justify-center bg-white">
          <Sparkles className="h-20 text-[#000] fill-[#000]" />
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <h1 className="text-xl md:text-3xl font-semibold">
          Edit images using prompts.
        </h1>
        <p className="text-xs md:text-sm mb-2">
          LazeEdit - The AI-First Image Editor.
        </p>
        <Button
          // disabled={mutation.isPending}
          onClick={onClick}
          variant="default"
          className="w-[160px] bg-white text-black"
        >
          Start creating
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
