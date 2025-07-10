import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Trash2, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import {
  getProjects,
  duplicateProject,
  deleteProject,
} from "../actions/project.actions";
import { useRouter } from "next/navigation";

const ProjectsTable = ({ store }) => {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionState, setActionState] = useState(null);
  const limit = 10;

  useEffect(() => {
    fetchProjects();
  }, [currentPage]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getProjects(store.id, currentPage, limit);
      setProjects(response.rows);
      setTotalPages(Math.ceil(response.count / limit));
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (e, project) => {
    setActionLoading(true);
    setActionState("copy");
    e.stopPropagation();
    e.preventDefault();
    try {
      const newProject = await duplicateProject(project.id);

      if (newProject) {
        setActionLoading(false);
        setActionState(null);
        const oldProject = projects.find((p) => p.id === project.id);
        setProjects((prev) => [oldProject, ...prev]);
        toast.success("Project duplicated successfully");
      } else {
        setActionLoading(false);
        setActionState(null);
        toast.error("Failed to duplicate project");
      }
    } catch (error) {
      setActionLoading(false);
      setActionState(null);
      console.error("Error duplicating project:", error);
    }
  };

  const handleDelete = async (e, project) => {
    e.stopPropagation();
    e.preventDefault();
    setActionLoading(true);
    setActionState("delete");
    try {
      await deleteProject(project.id);
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    } finally {
      setActionLoading(false);
      setActionState(null);
    }
  };

  return (
    <div className="w-full space-y-4 mt-8">
      <h3 className="text-xl font-semibold m-0 text-white/70">
        Recent Projects
      </h3>
      <div className="min-h-[300px]">
        <Table>
          <TableHeader>
            <TableRow className="glass-strong hover:glass-strong text-white">
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Dimensions</TableHead>
              <TableHead className="text-white">Last Updated</TableHead>
              <TableHead className="w-16 text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id} className="cursor-pointer">
                <TableCell onClick={() => router.push(`/editor/${project.id}`)}>
                  {project.name}
                </TableCell>
                <TableCell
                  onClick={() => router.push(`/editor/${project.id}`)}
                >{`${project.width} x ${project.height}`}</TableCell>
                <TableCell onClick={() => router.push(`/editor/${project.id}`)}>
                  {format(new Date(project.updatedAt), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => handleCopy(e, project)}>
                        {actionLoading && actionState == "copy" ? (
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Copy className="mr-2 h-4 w-4" />
                        )}
                        Copy
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => handleDelete(e, project)}
                        className="text-red-600"
                      >
                        {actionLoading && actionState == "delete" ? (
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}

            {projects.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-white/70">
                  No projects found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center mt-8">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
          className="bg-white text-black"
          disabled={currentPage === 0 || loading}
        >
          Previous
        </Button>
        <span className="text-sm text-white/70">
          Page {currentPage + 1} of {totalPages}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
          }
          className="bg-white text-black"
          disabled={currentPage >= totalPages - 1 || loading}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProjectsTable;
