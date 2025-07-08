import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getAllTemplates, duplicateTemplate } from "../actions/project.actions";
import { IoIosArrowDropright, IoIosArrowDropleft } from "react-icons/io";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "lucide-react";

const AllTemplates = ({ store }) => {
  const router = useRouter();
  const [templates, setTemplates] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [disable, setDisable] = useState(false);
  const [templateToCopy, setTemplateToCopy] = useState(null);
  const [templateCache, setTemplateCache] = useState({});
  const limit = 5;

  console.log(totalPages, currentPage, "hello");

  useEffect(() => {
    // Effect to handle page changes
    fetchTemplatesWithCache();
  }, [currentPage]);

  const fetchTemplatesWithCache = async () => {
    // Check if we already have this page in cache
    if (templateCache[currentPage]) {
      setTemplates(templateCache[currentPage].templates);
      setTotalPages(templateCache[currentPage].totalPages);
      return;
    }

    // If not in cache, fetch from server
    try {
      setLoading(true);
      const response = await getAllTemplates(currentPage, limit);

      // Update the templates state
      setTemplates(response.rows);
      const calculatedTotalPages = Math.ceil(response.count / limit);
      setTotalPages(calculatedTotalPages);

      // Update the cache with new data
      setTemplateCache((prevCache) => ({
        ...prevCache,
        [currentPage]: {
          templates: response.rows,
          totalPages: calculatedTotalPages,
          timestamp: Date.now(), // Add timestamp for potential cache invalidation
        },
      }));
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to invalidate cache (useful for manual refresh or when cache gets stale)
  const invalidateCache = (specificPage = null) => {
    if (specificPage !== null) {
      // Invalidate specific page
      setTemplateCache((prevCache) => {
        const newCache = { ...prevCache };
        delete newCache[specificPage];
        return newCache;
      });
    } else {
      // Invalidate all cache
      setTemplateCache({});
    }
  };

  // Function to manually refresh current page
  const refreshCurrentPage = () => {
    invalidateCache(currentPage);
    fetchTemplatesWithCache();
  };

  const handlePageChange = (newPage) => {
    if (newPage === currentPage) {
      return;
    }
    // Clear current templates to show loading state while we fetch/retrieve
    setTemplates([]);
    setCurrentPage(newPage);
  };

  async function handleCopy(project) {
    try {
      setTemplateToCopy(project.id);
      setDisable(true);
      const newProject = await duplicateTemplate(store.id, project.id);
      console.log(newProject);
      router.push(`/editor/${newProject.id}`);
    } catch (error) {
      setTemplateToCopy(null);
      console.error("Error duplicating project:", error);
    } finally {
      setTemplateToCopy(null);
      setDisable(false);
    }
  }

  return (
    <div className="w-full space-y-4 mt-8">
      <div className="flex items-center gap-4">
        <h3 className="text-xl font-semibold m-0">All Templates</h3>
        <div className="flex justify-between items-center gap-2">
          <IoIosArrowDropleft
            size="34px"
            className="cursor-pointer text-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
            disabled={currentPage < 1 || loading}
          />
          <IoIosArrowDropright
            size="34px"
            className="cursor-pointer text-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed"
            onClick={() =>
              handlePageChange(Math.min(totalPages - 1, currentPage + 1))
            }
            disabled={currentPage >= totalPages - 1 || loading}
          />
          <span className="text-sm text-gray-600 ml-4">
            Page {currentPage + 1} of {totalPages || 1}
          </span>
        </div>
      </div>

      {templates.length === 0 && loading && (
        <div className="grid grid-cols-5 md:grid-cols-5 lg:grid-cols-5 gap-4 min-h-[293px]">
          <Skeleton className=" h-[300px]" />
          <Skeleton className=" h-[300px]" />
          <Skeleton className=" h-[300px]" />
          <Skeleton className=" h-[300px]" />
          <Skeleton className=" h-[300px]" />
        </div>
      )}

      {/* Grid Container */}
      <div className="grid grid-cols-5 md:grid-cols-5 lg:grid-cols-5 gap-4">
        {templates.length > 0 &&
          templates.map((template) => (
            <div
              key={template.id}
              className="rounded-lg border border-gray-200 overflow-hidden shadow-sm cursor-pointer"
            >
              <div className="relative group w-full aspect-square">
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={template.thumbnailUrl}
                    alt="template"
                    className="w-full h-full object-cover transition-all duration-300 group-hover:blur-sm"
                  />
                </div>

                <div
                  onClick={() => handleCopy(template)}
                  className={`${
                    templateToCopy === template.id && "!opacity-100"
                  } absolute inset-0 bg-black/60 opacity-0 group-hover:!opacity-100 transition-all duration-300 flex items-center justify-center
                     `}
                >
                  <div
                    className={`transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ${
                      templateToCopy === template.id && "!translate-y-0"
                    }`}
                  >
                    {templateToCopy === template.id ? (
                      <Loader className="animate-spin h-8 w-8 text-white" />
                    ) : (
                      <span className="text-white font-semibold text-lg bg-black/40 px-4 py-2 rounded-md">
                        START PROJECT
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {templates.length === 0 && !loading && (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No templates found</p>
        </div>
      )}
    </div>
  );
};

export default AllTemplates;
