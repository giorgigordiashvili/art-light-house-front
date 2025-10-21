"use client";
import React, { useState, useRef } from "react";
import styled from "styled-components";

const UploadContainer = styled.div`
  border: 2px dashed #e5e5e5;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s;
  background: #fafafa;

  &:hover {
    border-color: #2b3445;
    background: #f5f5f5;
  }

  &.dragging {
    border-color: #2b3445;
    background: #f0f8ff;
  }
`;

const UploadButton = styled.button`
  background: #2b3445;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 1rem;
  transition: background 0.2s;

  &:hover {
    background: #1e2633;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadText = styled.p`
  color: #7d879c;
  margin: 0.5rem 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #e5e5e5;
  border-radius: 2px;
  overflow: hidden;
  margin: 1rem 0;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: #2b3445;
  width: ${(props) => props.progress}%;
  transition: width 0.3s ease;
`;

const ErrorMessage = styled.div`
  color: #d23f57;
  background: #fee;
  padding: 0.5rem;
  border-radius: 4px;
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
`;

const PreviewItem = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e5e5;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #d23f57;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #b91c3c;
  }
`;

interface UploadedImage {
  fileId: string;
  url: string;
  name: string;
  size: number;
}

interface ImageUploadProps {
  onImagesChange: (images: UploadedImage[]) => void;
  initialImages?: UploadedImage[];
  maxFiles?: number;
  folder?: string;
  disabled?: boolean;
}

const ImageUpload = ({
  onImagesChange,
  initialImages = [],
  maxFiles = 10,
  folder = "products",
  disabled = false,
}: ImageUploadProps) => {
  const [images, setImages] = useState<UploadedImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const uploadFiles = async (files: FileList) => {
    if (disabled) return;

    setError(null);
    setUploading(true);
    setUploadProgress(0);

    const remainingSlots = maxFiles - images.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    try {
      const uploadPromises = filesToUpload.map(async (file, index) => {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          throw new Error(`File ${file.name} is not an image`);
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`File ${file.name} is too large (max 10MB)`);
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", file.name);
        formData.append("folder", folder);

        const response = await fetch("/api/upload/image", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Upload failed");
        }

        const uploadedImage = await response.json();

        // Update progress
        const progress = ((index + 1) / filesToUpload.length) * 100;
        setUploadProgress(progress);

        return uploadedImage;
      });

      const uploadedImages = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedImages];

      setImages(newImages);
      onImagesChange(newImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFiles(files);
    }
  };

  const handleRemoveImage = async (image: UploadedImage, index: number) => {
    if (disabled) return;

    try {
      // Delete from server
      await fetch(`/api/upload/image?fileId=${image.fileId}`, {
        method: "DELETE",
      });

      // Remove from local state
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
      onImagesChange(newImages);
    } catch {
      setError("Failed to delete image");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      uploadFiles(files);
    }
  };

  const canUploadMore = images.length < maxFiles;

  return (
    <div>
      {canUploadMore && (
        <UploadContainer
          className={isDragging ? "dragging" : ""}
          onClick={!uploading ? handleFileSelect : undefined}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadButton type="button" disabled={uploading || disabled}>
            {uploading ? "Uploading..." : "Choose Images"}
          </UploadButton>
          <UploadText>Or drag and drop images here</UploadText>
          <UploadText style={{ fontSize: "0.8rem" }}>
            {images.length}/{maxFiles} images • Max 10MB per file
          </UploadText>

          {uploading && (
            <ProgressBar>
              <ProgressFill progress={uploadProgress} />
            </ProgressBar>
          )}

          <HiddenInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={uploading || disabled}
          />
        </UploadContainer>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {images.length > 0 && (
        <PreviewContainer>
          {images.map((image, index) => (
            <PreviewItem key={image.fileId}>
              <PreviewImage src={image.url} alt={image.name} />
              {!disabled && (
                <RemoveButton
                  type="button"
                  onClick={() => handleRemoveImage(image, index)}
                  title="Remove image"
                >
                  ×
                </RemoveButton>
              )}
            </PreviewItem>
          ))}
        </PreviewContainer>
      )}
    </div>
  );
};

export default ImageUpload;
