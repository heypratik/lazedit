"use client";

import React from 'react'
import {Editor} from '@/features/editor/components/editor'
import Link from "next/link";
import { Loader, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {getProjectById} from "./../actions/project.actions"
import {useGetProject} from "../hooks/use-get-project"

interface EditorProjectIdPageProps {
  params: {
    projectId: string;
  };
};

export default function EditorProjectIdPage({
  params,
}: EditorProjectIdPageProps) {

  // const data = await getProjectById(params.projectId);
  const { data, isLoading, isError } = useGetProject(params.projectId);

  if (isLoading || !data) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen flex flex-col gap-y-5 items-center justify-center">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <p className="text-muted-foreground text-sm">
          Failed to fetch project
        </p>
        <Button asChild variant="default" className='bg-black text-white'>
          <Link href="/editor">
            Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  return <Editor initialData={data} />
};


