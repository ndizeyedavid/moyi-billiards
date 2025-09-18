"use client";

import { useState, useTransition, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Upload, Save, Eye, Calendar, Clock } from "lucide-react";
import { createBlogPost, updateBlogPost } from "@/lib/actions/blog-posts";
import { BlogPostInput } from "@/lib/validations";
import { toast } from "sonner";
import Image from "next/image";
import { ImageUpload } from "@/components/ui/image-upload";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BlogPost extends BlogPostInput {
  id?: string;
  readTime?: number;
  wordCount?: number;
  publishedAt?: Date;
}

interface BlogPostFormProps {
  post?: BlogPost;
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: BlogPost) => void;
}

const categories = [
  "History",
  "Buying Guide",
  "Maintenance",
  "Professional",
  "Craftsmanship",
  "News",
];
const statuses = ["Published", "Draft", "Scheduled"];
const authors = ["Wilson Moyi", "Admin"];

export default function BlogPostForm({
  post,
  isOpen,
  onClose,
  onSave,
}: BlogPostFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<BlogPost>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    author: "Wilson Moyi",
    category: "News",
    status: "Draft",
    featured: false,
    publishedAt: new Date(),
    tags: [],
    metaTitle: "",
    metaDescription: "",
    featuredImage: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when post prop changes
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || "",
        slug: post.slug || "",
        content: post.content || "",
        excerpt: post.excerpt || "",
        author: post.author || "Wilson Moyi",
        category: post.category || "News",
        status: post.status || "Draft",
        featured: post.featured || false,
        publishedAt: post.publishedAt || new Date(),
        tags: post.tags || [],
        metaTitle: post.metaTitle || "",
        metaDescription: post.metaDescription || "",
        featuredImage: post.featuredImage || "",
      });
    } else {
      // Reset form for new post
      setFormData({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        author: "Wilson Moyi",
        category: "News",
        status: "Draft",
        featured: false,
        publishedAt: new Date(),
        tags: [],
        metaTitle: "",
        metaDescription: "",
        featuredImage: "",
      });
    }
    // Clear errors when switching between add/edit modes
    setErrors({});
    setTagInput("");
  }, [post]);

  const handleInputChange = (field: keyof BlogPost, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-generate slug from title
    if (field === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setFormData((prev) => ({ ...prev, slug }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUpload = (url: string) => {
    handleInputChange("featuredImage", url);
  };

  const handleImageRemove = () => {
    handleInputChange("featuredImage", "");
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleInputChange("tags", [...formData.tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange(
      "tags",
      formData.tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (!formData.excerpt?.trim()) newErrors.excerpt = "Excerpt is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    startTransition(async () => {
      try {
        console.log("Saving blog post...");
        let result;

        if (post?.id) {
          result = await updateBlogPost(post.id, formData);
        } else {
          result = await createBlogPost(formData);
        }

        if (result.success) {
          toast.success(
            post?.id
              ? "Blog post updated successfully!"
              : "Blog post created successfully!"
          );
          onSave({ ...formData, id: post?.id || result.data?.id });
          onClose();
        } else {
          toast.error(
            result.error || "Failed to save blog post. Please try again."
          );
        }
      } catch (error) {
        toast.error("An unexpected error occurred. Please try again.");
        console.error("Error saving blog post:", error);
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-background rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">
            {post ? "Edit Blog Post" : "Create New Blog Post"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content - 2/3 width */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Post Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        placeholder="Enter post title"
                        className={errors.title ? "border-red-500" : ""}
                      />
                      {errors.title && (
                        <p className="text-sm text-red-500">{errors.title}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug">URL Slug *</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) =>
                          handleInputChange("slug", e.target.value)
                        }
                        placeholder="post-url-slug"
                        className={errors.slug ? "border-red-500" : ""}
                      />
                      {errors.slug && (
                        <p className="text-sm text-red-500">{errors.slug}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        URL: /blog/{formData.slug}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt *</Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) =>
                          handleInputChange("excerpt", e.target.value)
                        }
                        placeholder="Brief description of the post"
                        rows={3}
                        className={errors.excerpt ? "border-red-500" : ""}
                      />
                      {errors.excerpt && (
                        <p className="text-sm text-red-500">{errors.excerpt}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Content *</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) =>
                          handleInputChange("content", e.target.value)
                        }
                        placeholder="Write your blog post content here..."
                        rows={15}
                        className={errors.content ? "border-red-500" : ""}
                      />
                      {errors.content && (
                        <p className="text-sm text-red-500">{errors.content}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Word count:{" "}
                        {formData.content.trim().split(/\s+/).length} words •
                        Estimated read time:{" "}
                        {calculateReadTime(formData.content)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* SEO Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>SEO Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="metaTitle">Meta Title</Label>
                      <Input
                        id="metaTitle"
                        value={formData.metaTitle}
                        onChange={(e) =>
                          handleInputChange("metaTitle", e.target.value)
                        }
                        placeholder="SEO title (leave empty to use post title)"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="metaDescription">Meta Description</Label>
                      <Textarea
                        id="metaDescription"
                        value={formData.metaDescription}
                        onChange={(e) =>
                          handleInputChange("metaDescription", e.target.value)
                        }
                        placeholder="SEO description (leave empty to use excerpt)"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - 1/3 width */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Publish Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          handleInputChange("status", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="author">Author</Label>
                      <Select
                        value={formData.author}
                        onValueChange={(value) =>
                          handleInputChange("author", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select author" />
                        </SelectTrigger>
                        <SelectContent>
                          {authors.map((author) => (
                            <SelectItem key={author} value={author}>
                              {author}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="publishedAt">Publish Date</Label>
                      <Input
                        id="publishedAt"
                        type="date"
                        value={
                          formData.publishedAt
                            ? new Date(formData.publishedAt)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "publishedAt",
                            new Date(e.target.value)
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) =>
                          handleInputChange("featured", checked)
                        }
                      />
                      <Label htmlFor="featured">Featured Post</Label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Categories & Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleInputChange("category", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <div className="flex gap-2">
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder="Add tag"
                          onKeyPress={(e) =>
                            e.key === "Enter" && (e.preventDefault(), addTag())
                          }
                        />
                        <Button type="button" onClick={addTag} size="sm">
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => removeTag(tag)}
                          >
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Featured Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ImageUpload
                      value={formData.featuredImage || ""}
                      onChange={handleImageUpload}
                      onRemove={handleImageRemove}
                      folder="blog"
                      placeholder="Upload featured image"
                      aspectRatio="video"
                      width={200}
                      height={120}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex items-center gap-2">
                {formData.featured && <Badge variant="outline">Featured</Badge>}
                <Badge
                  variant={
                    formData.status === "Published" ? "default" : "secondary"
                  }
                >
                  {formData.status}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {formData.publishedAt
                    ? new Date(formData.publishedAt).toLocaleDateString()
                    : "Not set"}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {calculateReadTime(formData.content)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  {post ? "Update Post" : "Save Post"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
