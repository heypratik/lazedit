"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CustomLayout from "../../layout/layout";
import { MdDelete } from "react-icons/md";
import { RiLoader4Fill } from "react-icons/ri";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// API functions
const fetchTemplates = async () => {
  const response = await fetch("/api/admin/templates/get-templates", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch templates");
  }

  return response.json();
};

const uploadTemplate = async ({ jsonFile, htmlFile }) => {
  const jsonReader = new FileReader();
  const htmlReader = new FileReader();

  return new Promise((resolve, reject) => {
    jsonReader.onload = (e) => {
      const jsonContent = e.target.result;

      htmlReader.onload = async (e) => {
        const htmlContent = e.target.result;

        try {
          const response = await fetch("/api/admin/templates/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              template: jsonContent,
              html: htmlContent,
            }),
          });

          if (!response.ok) {
            throw new Error("Error uploading files");
          }

          const newTemplate = await response.json();
          resolve(newTemplate);
        } catch (error) {
          reject(error);
        }
      };
      htmlReader.readAsText(htmlFile);
    };
    jsonReader.readAsText(jsonFile);
  });
};

const deleteTemplate = async (templateId) => {
  const response = await fetch("/api/admin/templates/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ templateId }),
  });

  if (!response.ok) {
    throw new Error("Error deleting template");
  }

  return response.json();
};

const saveTags = async (
  templateId,
  brandTags,
  campaignTypeTags,
  industryTags
) => {
  // convert tags to array
  brandTags = brandTags?.split(",")?.map((tag) => tag?.trim());
  campaignTypeTags = campaignTypeTags?.split(",")?.map((tag) => tag?.trim());
  industryTags = industryTags?.split(",")?.map((tag) => tag?.trim());

  const response = await fetch("/api/admin/templates/update-tags", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      templateId,
      brandTags,
      campaignTypeTags,
      industryTags,
    }),
  });

  if (!response.ok) {
    throw new Error("Error updating tags");
  }

  return response.json();
};

const TemplateUploader = () => {
  const [jsonFile, setJsonFile] = useState(null);
  const [htmlFile, setHtmlFile] = useState(null);

  const [brandTags, setBrandTags] = useState([]);
  const [campaignTypeTags, setCampaignTypeTags] = useState([]);
  const [industryTags, setIndustryTags] = useState([]);
  const [savingTags, setSavingTags] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const queryClient = useQueryClient();

  // Fetch templates query
  const {
    data: templates,
    isLoading: isTemplatesLoading,
    isFetching: isTemplatesFetching,
  } = useQuery({
    queryKey: ["templates"],
    queryFn: fetchTemplates,
  });

  function handleTagChange(e) {
    const { name, value } = e.target;
    console.log(name, value);
    switch (name) {
      case "brandTags":
        setBrandTags(value);
        break;
      case "campaignTypeTags":
        setCampaignTypeTags(value);
        break;
      case "industryTags":
        setIndustryTags(value);
        break;
      default:
        break;
    }
  }

  const handleSaveTags = async (
    templateId,
    brandTags,
    campaignTypeTags,
    industryTags
  ) => {
    setSavingTags(true);
    const res = await saveTags(
      templateId,
      brandTags,
      campaignTypeTags,
      industryTags
    );

    if (res.status === 200) {
      queryClient.invalidateQueries("templates");
      // Update Query Client with new tags
      queryClient.setQueryData(["templates"], (oldData) => {
        return oldData.map((template) => {
          if (template.id === templateId) {
            const newT = {
              ...template,
              brandTags: brandTags?.split(",")?.map((tag) => tag.trim()),
              campaignTypeTag: campaignTypeTags
                ?.split(",")
                ?.map((tag) => tag.trim()),
              industryTags: industryTags?.split(",")?.map((tag) => tag.trim()),
            };
            return newT;
          }

          return template;
        });
      });

      setOpenDialog(false);
      setSavingTags(false);
      setBrandTags([]);
      setCampaignTypeTags([]);
      setIndustryTags([]);
    } else {
      setSavingTags(false);
      alert("Error saving tags");
    }
  };

  // Upload template mutation
  const { mutate: uploadTemplateMutation, isPending: isUploading } =
    useMutation({
      mutationFn: uploadTemplate,
      onSuccess: (newTemplate) => {
        // Optimistically update the cache
        queryClient.setQueryData("templates", (oldData) => {
          return oldData ? [...oldData, newTemplate] : [newTemplate];
        });

        alert("Files uploaded successfully!");
        // Reset file inputs
        setJsonFile(null);
        setHtmlFile(null);
      },
      onError: (error) => {
        console.error("Error uploading files:", error);
        alert("Failed to upload files");
      },
    });

  // Delete template mutation
  const { mutate: deleteTemplateMutation, isPending } = useMutation({
    mutationFn: deleteTemplate,
    onSuccess: (_, templateId) => {
      // Optimistically update the cache
      queryClient.setQueryData("templates", (oldData) =>
        oldData.filter((template) => template.id !== templateId)
      );

      alert("Template deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting template:", error);
      alert("Failed to delete template");
    },
  });

  // Handle file upload
  const handleFileUpload = () => {
    if (!jsonFile || !htmlFile) {
      return alert("Please select both JSON and HTML files.");
    }

    uploadTemplateMutation({ jsonFile, htmlFile });
  };

  // Handle template deletion
  const handleDeleteTemplate = (templateId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this template?"
    );
    if (!confirmDelete) return;

    deleteTemplateMutation(templateId);
  };

  return (
    <CustomLayout>
      <div className="w-full p-4 flex flex-col items-center justify-center">
        <div className="flex items-end space-x-2">
          {/* JSON File Input */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Upload JSON:</label>
            <input
              type="file"
              accept="application/json"
              onChange={(e) => setJsonFile(e.target.files[0])}
              className="p-1 text-sm border rounded"
            />
          </div>

          {/* HTML File Input */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Upload HTML:</label>
            <input
              type="file"
              accept="text/html"
              onChange={(e) => setHtmlFile(e.target.files[0])}
              className="p-1 text-sm border rounded"
            />
          </div>

          {/* Upload Button */}
          <button
            onClick={handleFileUpload}
            className="px-3 flex gap-2 py-2 bg-[#f12d4d] text-white rounded text-sm hover:bg-[#fc5c76]"
            disabled={isUploading}
          >
            {isUploading && (
              <RiLoader4Fill fontSize={20} className="animate-spin" />
            )}
            Upload
          </button>
        </div>

        {/* Divider */}
        <div className="w-full border-b my-8"></div>

        {/* Display Existing Templates */}
        <div className="w-full">
          {templates && templates.length > 0 && (
            <div className="text-sm font-medium mb-2">Existing Templates:</div>
          )}
          {isTemplatesLoading ? (
            <div className="text-center">Loading templates...</div>
          ) : (
            <ul className="p-0 m-0">
              {templates?.map((template) => (
                <li
                  key={template.id}
                  className="border rounded p-2 text-sm flex justify-between items-center mb-2"
                >
                  <span>Template ID: {template.id}</span>
                  <span>
                    Created At: {new Date(template.createdAt).toLocaleString()}
                  </span>
                  <span>
                    Last Updated At:{" "}
                    {new Date(template.updatedAt).toLocaleString()}
                  </span>
                  <div className="text-gray-600">
                    <span>
                      {template.template ? "JSON Uploaded" : "No JSON"}
                    </span>{" "}
                    | <span>{template.html ? "HTML Uploaded" : "No HTML"}</span>
                  </div>
                  <span className="flex gap-4 items-center justify-end">
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                      <DialogTrigger asChild>
                        <Button
                          variant="link"
                          className=" text-black"
                          onClick={() => {
                            setSelectedTemplate(template.id);
                            setBrandTags(template?.brandTags?.join(", "));
                            setCampaignTypeTags(
                              template?.campaignTypeTag?.join(", ")
                            );
                            setIndustryTags(template?.industryTags?.join(", "));
                          }}
                        >
                          Add / Edit Tags
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Add/Edit Tags</DialogTitle>
                          <DialogDescription>
                            Add comma separated tags. Eg: tag1, tag2, tag3
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center justify-center gap-4 py-4">
                          <div className="flex items-start gap-2 w-full justify-start flex-col">
                            <label className="text-sm font-medium">
                              Brand Tags:
                            </label>
                            <textarea
                              type="textarea"
                              value={brandTags}
                              name="brandTags"
                              className="p-2 w-full border rounded"
                              onChange={(e) => handleTagChange(e)}
                            />
                          </div>
                          <div className="flex items-start gap-2 w-full justify-start flex-col">
                            <label className="text-sm font-medium">
                              Campaign Type Tags:
                            </label>
                            <textarea
                              type="textarea"
                              value={campaignTypeTags}
                              name="campaignTypeTags"
                              className="p-2 w-full border rounded"
                              onChange={(e) => handleTagChange(e)}
                            />
                          </div>
                          <div className="flex items-start gap-2 w-full justify-start flex-col">
                            <label className="text-sm font-medium">
                              Industry Tags:
                            </label>
                            <textarea
                              type="textarea"
                              value={industryTags}
                              name="industryTags"
                              className="p-2 w-full border rounded"
                              onChange={(e) => handleTagChange(e)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            className="bg-[#f23250] flex items-center gap-2"
                            type="submit"
                            onClick={() =>
                              handleSaveTags(
                                selectedTemplate,
                                brandTags,
                                campaignTypeTags,
                                industryTags
                              )
                            }
                          >
                            <RiLoader4Fill
                              fontSize={20}
                              className={`spinner ${
                                savingTags ? "block" : "hidden"
                              }`}
                            />
                            Save changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <MdDelete
                      className="cursor-pointer text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteTemplate(template.id)}
                    />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </CustomLayout>
  );
};

export default TemplateUploader;
