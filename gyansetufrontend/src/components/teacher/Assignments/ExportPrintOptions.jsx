import React, { useState } from "react";
import {
  Printer,
  Download,
  FileText,
  CheckSquare,
  Eye,
  Settings,
  Copy,
  X,
} from "lucide-react";

export default function ExportPrintOptions() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState("pdf");
  const [exportType, setExportType] = useState("teacher");
  const [showAnswers, setShowAnswers] = useState(true);
  const [includeRubric, setIncludeRubric] = useState(true);
  const [includeInstructions, setIncludeInstructions] = useState(true);

  // Toggle export modal
  const toggleExportModal = () => {
    setShowExportModal(!showExportModal);
  };

  // Handle export/download
  const handleExport = () => {
    // In a real application, this would trigger the PDF generation
    // and download using a library like jsPDF or an API call

    // For this demo, we'll simulate the download
    setTimeout(() => {
      // Close the modal after "download" completes
      setShowExportModal(false);
    }, 1000);
  };

  // Format options
  const formatOptions = [
    {
      id: "pdf",
      name: "PDF Document",
      description: "Best for printing and sharing",
    },
    {
      id: "docx",
      name: "Word Document (.docx)",
      description: "Editable in Microsoft Word",
    },
    {
      id: "html",
      name: "Web Page (.html)",
      description: "Open in any web browser",
    },
    {
      id: "png",
      name: "Image (.png)",
      description: "Screenshot of the assignment",
    },
  ];

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-500">
        <h2 className="text-xl font-bold mb-6 text-purple-800">
          Assignment Export Options
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Quick Actions
            </h3>

            <button
              onClick={toggleExportModal}
              className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
            >
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <Download className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-800">
                    Download Assignment
                  </h4>
                  <p className="text-sm text-gray-600">
                    Save as PDF, Word, or other formats
                  </p>
                </div>
              </div>
              <div className="text-purple-500">
                <Eye className="h-5 w-5" />
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <Printer className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-800">
                    Print Assignment
                  </h4>
                  <p className="text-sm text-gray-600">
                    Print directly to your printer
                  </p>
                </div>
              </div>
              <div className="text-purple-500">
                <Settings className="h-5 w-5" />
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <Copy className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-800">
                    Duplicate Assignment
                  </h4>
                  <p className="text-sm text-gray-600">
                    Create a copy to modify
                  </p>
                </div>
              </div>
              <div className="text-purple-500">
                <CheckSquare className="h-5 w-5" />
              </div>
            </button>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Preview</h3>

            <div className="bg-white shadow-sm rounded-lg p-3 border border-gray-200 h-64 overflow-hidden flex flex-col items-center justify-center">
              <div className="w-full max-w-md mx-auto">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5 mb-4"></div>

                <div className="h-5 bg-gray-300 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>

                <div className="mt-3 flex space-x-2">
                  <div className="h-4 w-4 bg-gray-300 rounded-sm"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="mt-2 flex space-x-2">
                  <div className="h-4 w-4 bg-gray-300 rounded-sm"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>

              <FileText className="h-16 w-16 text-gray-300 mt-4" />
            </div>

            <div className="mt-4 flex justify-between">
              <button className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center">
                <Settings className="h-4 w-4 mr-1" />
                Preview Settings
              </button>

              <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                Full Preview
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                Export Assignment
              </h3>
              <button
                onClick={toggleExportModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Export Format
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {formatOptions.map((format) => (
                    <div
                      key={format.id}
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${
                        exportFormat === format.id
                          ? "bg-purple-50 border-purple-300"
                          : "bg-white border-gray-200 hover:border-purple-200"
                      }`}
                      onClick={() => setExportFormat(format.id)}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          checked={exportFormat === format.id}
                          onChange={() => {}}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 mr-2"
                        />
                        <div>
                          <h5 className="text-sm font-medium">{format.name}</h5>
                          <p className="text-xs text-gray-500">
                            {format.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Version Type
                </h4>
                <div className="flex space-x-4">
                  <div
                    className={`p-3 border rounded-md cursor-pointer transition-colors flex-1 ${
                      exportType === "teacher"
                        ? "bg-purple-50 border-purple-300"
                        : "bg-white border-gray-200 hover:border-purple-200"
                    }`}
                    onClick={() => setExportType("teacher")}
                  >
                    <div className="flex items-center mb-1">
                      <input
                        type="radio"
                        checked={exportType === "teacher"}
                        onChange={() => {}}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 mr-2"
                      />
                      <span className="text-sm font-medium">
                        Teacher Version
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 pl-6">
                      Includes answer key and notes
                    </p>
                  </div>

                  <div
                    className={`p-3 border rounded-md cursor-pointer transition-colors flex-1 ${
                      exportType === "student"
                        ? "bg-purple-50 border-purple-300"
                        : "bg-white border-gray-200 hover:border-purple-200"
                    }`}
                    onClick={() => setExportType("student")}
                  >
                    <div className="flex items-center mb-1">
                      <input
                        type="radio"
                        checked={exportType === "student"}
                        onChange={() => {}}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 mr-2"
                      />
                      <span className="text-sm font-medium">
                        Student Version
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 pl-6">
                      Question-only format for students
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Content Options
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showAnswers}
                      onChange={() => setShowAnswers(!showAnswers)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 mr-2"
                      disabled={exportType === "student"}
                    />
                    <span
                      className={`text-sm ${
                        exportType === "student"
                          ? "text-gray-400"
                          : "text-gray-700"
                      }`}
                    >
                      Include answer key
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeRubric}
                      onChange={() => setIncludeRubric(!includeRubric)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      Include grading rubric
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeInstructions}
                      onChange={() =>
                        setIncludeInstructions(!includeInstructions)
                      }
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      Include instructions
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
              <button
                onClick={toggleExportModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-3 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
