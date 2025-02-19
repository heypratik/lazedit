"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import {createProject} from "../actions/project.actions";

import { Button } from "@/components/ui/button";

export const Banner = ({store}: {
  store: any
}) => {
  const router = useRouter();
  // const mutation = useCreateProject();

  const onClick = async () => {
    const project = await createProject(store.id);

    if (project) {
      router.push(`/editor/${project.id}`);
    } else {
      console.log("Error creating project");
    }
  };

  return (
    <div className="text-white min-h-[248px] flex gap-x-6 p-6 items-center rounded-xl bg-gradient-to-r from-[#f23250] via-[#e93c56] to-[#f0586f]">
      <div className="rounded-full size-28 items-center justify-center bg-white/50 hidden md:flex">
        <div className="rounded-full size-20 flex items-center justify-center bg-white">
          <Sparkles className="h-20 text-[#f23250] fill-[#f23250]" />
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <h1 className="text-xl md:text-3xl font-semibold">
          Visualize your ideas with MyBranz Canvas
        </h1>
        <p className="text-xs md:text-sm mb-2">
          Turn inspiration into design in no time.
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
