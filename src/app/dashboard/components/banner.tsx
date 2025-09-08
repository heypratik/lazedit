"use client";

import { useRouter } from "next/navigation";
import { createProject } from "../actions/project.actions";

const tiles = [
  {
    id: 1,
    image:
      "https://pikaso.cdnpk.net/public/media/explorer/tools/ai-assistant.png",
    title: "Generate Images",
    description: "Create anything you can imagine with AI.",
  },
  {
    id: 2,
    image:
      "https://pikaso.cdnpk.net/public/media/explorer/tools/ai-upscale-images.png",
    title: "Upscale Images",
    description: "Enhance image quality with AI.",
  },
  {
    id: 3,
    image: "https://pikaso.cdnpk.net/public/media/explorer/tools/sketch.png",
    title: "Image to Sketch",
    description: "Convert images to sketches with AI.",
  },
  {
    id: 4,
    image:
      "https://pikaso.cdnpk.net/public/media/explorer/tools/ai-assistant.png",
    title: "Change Model Clothes",
    description: "Change model outfits with AI.",
  },
  {
    id: 5,
    image:
      "https://pikaso.cdnpk.net/public/media/explorer/tools/ai-assistant.png",
    title: "Remove Background",
    description: "Easily remove backgrounds from images.",
  },
  {
    id: 6,
    image:
      "https://pikaso.cdnpk.net/public/media/explorer/tools/ai-assistant.png",
    title: "Change Model Pose",
    description: "Adjust model poses with AI.",
  },
  {
    id: 7,
    image:
      "https://pikaso.cdnpk.net/public/media/explorer/tools/image-editor.png",
    title: "AI Product Editor ",
    description: "Edit product images with AI.",
  },
  {
    id: 8,
    image:
      "https://pikaso.cdnpk.net/public/media/explorer/tools/ai-assistant.png",
    title: "Start Blank Project",
    description: "Create a new project from scratch.",
  },
];

export const Banner = ({
  organization,
  userId,
}: {
  userId: any;
  organization: any;
}) => {
  const router = useRouter();

  const onClick = async () => {
    const project = await createProject(organization.id, userId);
    if (project) {
      router.push(`/dashboard/${project.id}`);
    } else {
      console.log("Error creating project");
    }
  };

  return (
    <>
      <h3 className="text-xl font-semibold m-0 text-white/70 mb-4">
        Make something amazing
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-0">
        {tiles.map((tile) => (
          <div
            onClick={onClick}
            key={tile.id}
            className=" cursor-pointer glass-subtle hover:glass-strong shadow-md p-3 flex gap-3"
          >
            <div className="flex-[0.5]">
              <img src={tile.image} alt={tile.title} className="w-full" />
            </div>
            <div className="flex-[1]">
              <h2 className="text-sm font-semibold mt-0 text-white">
                {tile.title}
              </h2>
              <p className="text-xs text-white">{tile.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
