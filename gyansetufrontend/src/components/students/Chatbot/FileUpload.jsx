import React, { useState, useRef } from 'react';
import { Upload, X, File, Image } from 'lucide-react';

const FileUpload = ({ onFilesSelected, currentFiles, onRemoveFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };
  
  // Handle file input selection
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  };
  
  // Trigger file input click
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  
  // Detect file type for icon display
  const getFileIcon = (file) => {
    if (file.type.includes('image')) {
      return <Image className="w-4 h-4 text-blue-500" />;
    } else if (file.type.includes('pdf')) {
      return <File className="w-4 h-4 text-red-500" />;
    } else if (file.type.includes('word') || file.type.includes('document')) {
      return <File className="w-4 h-4 text-blue-700" />;
    } else if (file.type.includes('spreadsheet') || file.type.includes('excel')) {
      return <File className="w-4 h-4 text-green-600" />;
    } else {
      return <File className="w-4 h-4 text-gray-500" />;
    }
  };
  
  // Format file size for display
  const formatFileSize = (sizeInBytes) => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };
  
  return (
    <div className="file-upload">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
        multiple
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
      />
      
      {/* Upload button */}
      <button
        className="text-gray-400 p-1 hover:text-violet-600 focus:outline-none"
        onClick={handleButtonClick}
        aria-label="Upload files"
      >
        <Upload className="w-5 h-5" />
      </button>
      
      {/* Drop zone - show only when needed */}
      {isDragging && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => setIsDragging(false)}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
            <Upload className="w-12 h-12 text-violet-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Drop files here</h3>
            <p className="text-gray-600 text-sm">
              Upload images, PDFs, DOC files, and more
            </p>
          </div>
        </div>
      )}
      
      {/* Display current files */}
      {currentFiles && currentFiles.length > 0 && (
        <div className="flex flex-wrap gap-1 md:gap-2 mb-2 mt-2 w-full">
          {Array.from(currentFiles).map((file, index) => (
            <div key={index} className="flex items-center bg-gray-200 rounded-full px-2 py-1">
              <span className="mr-1">{getFileIcon(file)}</span>
              <span className="text-xs text-gray-800 mr-1 truncate max-w-24 md:max-w-32">
                {file.name} ({formatFileSize(file.size)})
              </span>
              <button
                className="text-gray-500 hover:text-red-500 p-1"
                onClick={() => onRemoveFile(file)}
                aria-label={`Remove ${file.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;