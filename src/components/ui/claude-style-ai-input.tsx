"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Plus,
  SlidersHorizontal,
  ArrowUp,
  X,
  FileText,
  ImageIcon,
  Video,
  Music,
  Archive,
  ChevronDown,
  Check,
  Loader2,
  AlertCircle,
  Copy,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Types
export interface FileWithPreview {
  id: string;
  file: File;
  preview?: string;
  type: string;
  uploadStatus: "pending" | "uploading" | "complete" | "error";
  uploadProgress?: number;
  abortController?: AbortController;
  textContent?: string;
}

export interface PastedContent {
  id: string;
  content: string;
  timestamp: Date;
  wordCount: number;
}

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  badge?: string;
}

interface ChatInputProps {
  onSendMessage?: (
    message: string,
    files: FileWithPreview[],
    pastedContent: PastedContent[]
  ) => void;
  disabled?: boolean;
  placeholder?: string;
  maxFiles?: number;
  maxFileSize?: number;
  acceptedFileTypes?: string[];
  models?: ModelOption[];
  defaultModel?: string;
  onModelChange?: (modelId: string) => void;
}

const MAX_FILES = 10;
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const PASTE_THRESHOLD = 200;

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getFileTypeLabel = (type: string): string => {
  const parts = type.split("/");
  let label = parts[parts.length - 1].toUpperCase();
  if (label.length > 10) label = label.substring(0, 10) + "...";
  return label;
};

const isTextualFile = (file: File): boolean => {
  const textualTypes = ["text/", "application/json", "application/xml", "application/javascript"];
  const textualExtensions = ["txt","md","py","js","ts","jsx","tsx","html","css","json","xml","yaml","yml","csv","sql","sh","php","go","java","c","cpp","rs","swift"];
  const isTextualMimeType = textualTypes.some((type) => file.type.toLowerCase().startsWith(type));
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  return isTextualMimeType || textualExtensions.includes(extension);
};

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || "");
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

const getFileExtension = (filename: string): string => {
  const extension = filename.split(".").pop()?.toUpperCase() || "FILE";
  return extension.length > 8 ? extension.substring(0, 8) + "..." : extension;
};

// File Preview Card
const FilePreviewCard: React.FC<{ file: FileWithPreview; onRemove: (id: string) => void }> = ({ file, onRemove }) => {
  const isImage = file.type.startsWith("image/");
  const isTextual = isTextualFile(file.file);

  if (isTextual) {
    return <TextualFilePreviewCard file={file} onRemove={onRemove} />;
  }

  return (
    <div className="relative group w-36 h-24 rounded-lg overflow-hidden border border-border bg-card shrink-0">
      <div className="w-full h-full flex items-center justify-center">
        {isImage && file.preview ? (
          <img src={file.preview} alt={file.file.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1 p-2">
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-bold bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                {getFileTypeLabel(file.type)}
              </span>
              {file.uploadStatus === "uploading" && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
              {file.uploadStatus === "error" && <AlertCircle className="h-3 w-3 text-destructive" />}
            </div>
            <p className="text-[10px] text-foreground truncate max-w-full">{file.file.name}</p>
            <p className="text-[9px] text-muted-foreground">{formatFileSize(file.file.size)}</p>
          </div>
        )}
      </div>
      <button
        onClick={() => onRemove(file.id)}
        className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-3 w-3 text-foreground" />
      </button>
    </div>
  );
};

// Pasted Content Card
const PastedContentCard: React.FC<{ content: PastedContent; onRemove: (id: string) => void }> = ({ content, onRemove }) => {
  const previewText = content.content.slice(0, 150);
  const needsTruncation = content.content.length > 150;

  return (
    <div className="relative group w-48 h-24 rounded-lg overflow-hidden border border-border bg-card shrink-0">
      <div className="p-2 text-[10px] text-muted-foreground overflow-hidden h-full">
        {needsTruncation ? previewText + "..." : content.content}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
        <span className="text-[9px] font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded">PASTED</span>
        <div className="flex gap-1">
          <button onClick={() => navigator.clipboard.writeText(content.content)} className="p-0.5 rounded bg-background/60">
            <Copy className="h-3 w-3 text-foreground" />
          </button>
          <button onClick={() => onRemove(content.id)} className="p-0.5 rounded bg-background/60">
            <X className="h-3 w-3 text-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Textual File Preview
const TextualFilePreviewCard: React.FC<{ file: FileWithPreview; onRemove: (id: string) => void }> = ({ file, onRemove }) => {
  const previewText = file.textContent?.slice(0, 150) || "";
  const needsTruncation = (file.textContent?.length || 0) > 150;
  const fileExtension = getFileExtension(file.file.name);

  return (
    <div className="relative group w-48 h-24 rounded-lg overflow-hidden border border-border bg-card shrink-0">
      <div className="p-2 text-[10px] text-muted-foreground overflow-hidden h-full font-mono">
        {file.textContent ? (needsTruncation ? previewText + "..." : file.textContent) : (
          <div className="flex items-center justify-center h-full"><Loader2 className="h-4 w-4 animate-spin" /></div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
        <span className="text-[9px] font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded">{fileExtension}</span>
        <div className="flex gap-1">
          {file.textContent && (
            <button onClick={() => navigator.clipboard.writeText(file.textContent || "")} className="p-0.5 rounded bg-background/60">
              <Copy className="h-3 w-3 text-foreground" />
            </button>
          )}
          <button onClick={() => onRemove(file.id)} className="p-0.5 rounded bg-background/60">
            <X className="h-3 w-3 text-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Model Selector
const ModelSelectorDropdown: React.FC<{
  models: ModelOption[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}> = ({ models, selectedModel, onModelChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedModelData = models.find((m) => m.id === selectedModel) || models[0];
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent"
      >
        <span className="truncate max-w-[140px]">{selectedModelData?.name || selectedModel}</span>
        <ChevronDown className="h-3 w-3" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 w-72 rounded-lg bg-card border border-border shadow-xl max-h-60 overflow-y-auto z-50">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => { onModelChange(model.id); setIsOpen(false); }}
              className={cn(
                "w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors flex items-center justify-between",
                model.id === selectedModel ? "bg-accent" : ""
              )}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-foreground text-xs">{model.name}</span>
                  {model.badge && (
                    <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">{model.badge}</span>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground">{model.description}</p>
              </div>
              {model.id === selectedModel && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Main ChatInput Component
export const ClaudeChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "O que você quer saber?",
  maxFiles = MAX_FILES,
  maxFileSize = MAX_FILE_SIZE,
  acceptedFileTypes,
  models,
  defaultModel,
  onModelChange,
}) => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [pastedContent, setPastedContent] = useState<PastedContent[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedModel, setSelectedModel] = useState(defaultModel || models?.[0]?.id || "");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const availableSlots = maxFiles - files.length;
    if (availableSlots <= 0) return;

    const filesToAdd = Array.from(selectedFiles).slice(0, availableSlots);
    const newFiles = filesToAdd
      .filter((file) => file.size <= maxFileSize)
      .map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
        type: file.type || "application/octet-stream",
        uploadStatus: "complete" as const,
        uploadProgress: 100,
      }));

    setFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((f) => {
      if (isTextualFile(f.file)) {
        readFileAsText(f.file).then((textContent) => {
          setFiles((prev) => prev.map((pf) => pf.id === f.id ? { ...pf, textContent } : pf));
        }).catch(() => {});
      }
    });
  }, [files.length, maxFiles, maxFileSize]);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const f = prev.find((x) => x.id === id);
      if (f?.preview) URL.revokeObjectURL(f.preview);
      return prev.filter((x) => x.id !== id);
    });
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    const fileItems = Array.from(items).filter((item) => item.kind === "file");
    if (fileItems.length > 0 && files.length < maxFiles) {
      e.preventDefault();
      const pastedFiles = fileItems.map((item) => item.getAsFile()).filter(Boolean) as File[];
      const dt = new DataTransfer();
      pastedFiles.forEach((f) => dt.items.add(f));
      handleFileSelect(dt.files);
      return;
    }

    const textData = e.clipboardData.getData("text");
    if (textData && textData.length > PASTE_THRESHOLD && pastedContent.length < 5) {
      e.preventDefault();
      setMessage((prev) => prev + textData.slice(0, PASTE_THRESHOLD) + "...");
      setPastedContent((prev) => [...prev, {
        id: crypto.randomUUID(),
        content: textData,
        timestamp: new Date(),
        wordCount: textData.split(/\s+/).filter(Boolean).length,
      }]);
    }
  }, [handleFileSelect, files.length, maxFiles, pastedContent.length]);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files) handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleSend = useCallback(() => {
    if (disabled || (!message.trim() && files.length === 0 && pastedContent.length === 0)) return;
    onSendMessage?.(message, files, pastedContent);
    setMessage("");
    files.forEach((f) => { if (f.preview) URL.revokeObjectURL(f.preview); });
    setFiles([]);
    setPastedContent([]);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [message, files, pastedContent, disabled, onSendMessage]);

  const handleModelChangeInternal = useCallback((modelId: string) => {
    setSelectedModel(modelId);
    onModelChange?.(modelId);
  }, [onModelChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const canSend = (message.trim() || files.length > 0 || pastedContent.length > 0) && !disabled;

  return (
    <div
      className="relative w-full rounded-xl border border-border bg-card overflow-hidden"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-primary/10 border-2 border-dashed border-primary rounded-xl flex items-center justify-center">
          <div className="flex items-center gap-2 text-primary">
            <UploadCloud className="h-5 w-5" />
            <span className="text-sm font-medium">Solte os arquivos aqui</span>
          </div>
        </div>
      )}

      <div className="flex flex-col">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[100px] max-h-[120px] w-full p-4 resize-none border-0 bg-transparent text-foreground shadow-none focus-visible:ring-0 placeholder:text-muted-foreground text-sm"
          rows={1}
        />

        <div className="flex items-center gap-2 justify-between w-full px-3 pb-2">
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || files.length >= maxFiles}
              title="Anexar arquivos"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              disabled={disabled}
              title="Opções"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {models && models.length > 0 && (
              <ModelSelectorDropdown
                models={models}
                selectedModel={selectedModel}
                onModelChange={handleModelChangeInternal}
              />
            )}
            <Button
              size="icon"
              className={cn(
                "h-8 w-8 rounded-md transition-colors",
                canSend
                  ? "bg-foreground hover:bg-foreground/90 text-background"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
              onClick={handleSend}
              disabled={!canSend}
              title="Enviar mensagem"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {(files.length > 0 || pastedContent.length > 0) && (
          <div className="overflow-x-auto border-t border-border p-3">
            <div className="flex gap-3">
              {pastedContent.map((content) => (
                <PastedContentCard
                  key={content.id}
                  content={content}
                  onRemove={(id) => setPastedContent((prev) => prev.filter((c) => c.id !== id))}
                />
              ))}
              {files.map((file) => (
                <FilePreviewCard key={file.id} file={file} onRemove={removeFile} />
              ))}
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept={acceptedFileTypes?.join(",")}
        onChange={(e) => { handleFileSelect(e.target.files); if (e.target) e.target.value = ""; }}
      />
    </div>
  );
};

export default ClaudeChatInput;
