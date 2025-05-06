import React, { useState } from "react";
import {
  AlertTriangle,
  Bell,
  CalendarClock,
  Send,
  Upload,
  X,
  Edit,
  Trash2,
  Eye,
  Search,
  Plus,
  Check,
  FileText,
} from "lucide-react";

const AnnouncementsManager = ({ announcements, onAddAnnouncement }) => {
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");

  // Form state for new announcement
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    date: "",
    priority: "medium",
    target: "all",
    attachments: [],
  });

  // Filter announcements based on search and priority
  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      searchTerm === "" ||
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (announcement.content &&
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPriority =
      filterPriority === "all" || announcement.priority === filterPriority;

    return matchesSearch && matchesPriority;
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnnouncementForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle create announcement
  const handleNewAnnouncement = () => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    setAnnouncementForm({
      title: "",
      content: "",
      date: formattedDate,
      priority: "medium",
      target: "all",
      attachments: [],
    });

    setIsEditMode(false);
    setShowAnnouncementModal(true);
  };

  // Handle edit announcement
  const handleEditAnnouncement = (announcement) => {
    setAnnouncementForm({
      ...announcement,
    });

    setIsEditMode(true);
    setSelectedAnnouncement(announcement);
    setShowAnnouncementModal(true);
  };

  // Handle view announcement
  const handleViewAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowViewModal(true);
  };

  // Handle submit announcement
  const handleSubmitAnnouncement = () => {
    if (isEditMode && selectedAnnouncement) {
      // Edit existing announcement logic would go here
      // For demo, we're just closing the modal
      setShowAnnouncementModal(false);
    } else {
      // Add new announcement
      onAddAnnouncement(announcementForm);
      setShowAnnouncementModal(false);
    }
  };

  // Handle template selection
  const handleTemplateSelect = (template) => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    switch (template) {
      case "exam":
        setAnnouncementForm({
          title: "Final Exam Schedule Released",
          content:
            "The final examination schedule for the current academic term has been released. All students are advised to review the schedule carefully and prepare accordingly. Teachers are requested to ensure that all necessary materials are covered before the examination period begins.\n\nExams will begin on [START DATE] and conclude on [END DATE]. Please ensure that you are aware of the specific timings and venues for your exams.",
          date: formattedDate,
          priority: "urgent",
          target: "all",
          attachments: [],
        });
        break;
      case "emergency":
        setAnnouncementForm({
          title: "Important Notice: School Closure",
          content:
            "Due to unforeseen circumstances, the school will remain closed on [DATE]. All scheduled classes, exams, and activities for this day stand canceled and will be rescheduled. Further information regarding the rescheduling will be communicated soon.\n\nWe apologize for any inconvenience caused.",
          date: formattedDate,
          priority: "urgent",
          target: "all",
          attachments: [],
        });
        break;
      case "event":
        setAnnouncementForm({
          title: "Upcoming School Event Reminder",
          content:
            "This is a reminder about the upcoming [EVENT NAME] scheduled for [DATE] at [TIME] in the [LOCATION]. All students are encouraged to participate and make this event a success.\n\nFor any queries, please contact the event coordinator.",
          date: formattedDate,
          priority: "medium",
          target: "all",
          attachments: [],
        });
        break;
      default:
        break;
    }

    setIsEditMode(false);
    setShowAnnouncementModal(true);
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "urgent":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
            Urgent
          </span>
        );
      case "high":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-800">
            High
          </span>
        );
      case "medium":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
            Medium
          </span>
        );
      case "low":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
            Low
          </span>
        );
      default:
        return null;
    }
  };

  // Get target audience badge
  const getTargetBadge = (target) => {
    switch (target) {
      case "all":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800">
            All Users
          </span>
        );
      case "students":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
            Students
          </span>
        );
      case "teachers":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-800">
            Teachers
          </span>
        );
      case "parents":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-pink-100 text-pink-800">
            Parents
          </span>
        );
      case "admin":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
            Admin
          </span>
        );
      default:
        return null;
    }
  };

  // Render announcement modal
  const renderAnnouncementModal = () => {
    if (!showAnnouncementModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
        <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-screen overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              {isEditMode ? "Edit Announcement" : "Create New Announcement"}
            </h3>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowAnnouncementModal(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={announcementForm.title}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter announcement title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                name="content"
                value={announcementForm.content}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="6"
                placeholder="Enter announcement content"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={announcementForm.priority}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Audience
                </label>
                <select
                  name="target"
                  value={announcementForm.target}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Users</option>
                  <option value="students">Students</option>
                  <option value="teachers">Teachers</option>
                  <option value="parents">Parents</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={announcementForm.date}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attachments (Optional)
              </label>
              <div className="border-dashed border-2 border-gray-300 rounded-md p-4 text-center">
                <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center justify-center mx-auto">
                  <Upload size={16} className="mr-1" />
                  Upload Files
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, DOC, XLS, JPG, PNG (Max 5MB)
                </p>
              </div>
            </div>

            {announcementForm.priority === "urgent" && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle
                      className="h-5 w-5 text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Urgent Announcement
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>
                        This announcement will be highlighted in red and will
                        trigger immediate notifications to all recipients.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
              onClick={() => setShowAnnouncementModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              onClick={handleSubmitAnnouncement}
            >
              {isEditMode ? "Update" : "Publish"} Announcement
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render view announcement modal
  const renderViewModal = () => {
    if (!showViewModal || !selectedAnnouncement) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
        <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-screen overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              Announcement Details
            </h3>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowViewModal(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedAnnouncement.title}
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                  {getPriorityBadge(selectedAnnouncement.priority)}
                  {getTargetBadge(selectedAnnouncement.target)}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <CalendarClock size={16} className="inline mr-1" />
                {selectedAnnouncement.date}
              </div>
            </div>

            <div className="border-t border-b py-4">
              <div className="prose text-gray-700 whitespace-pre-line">
                {selectedAnnouncement.content}
              </div>
            </div>

            {selectedAnnouncement.attachments &&
              selectedAnnouncement.attachments.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Attachments
                  </h4>
                  <div className="space-y-2">
                    {selectedAnnouncement.attachments.map(
                      (attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center p-2 border rounded-md"
                        >
                          <FileText size={16} className="text-blue-500 mr-2" />
                          <span className="text-sm">{attachment.name}</span>
                          <a
                            href="#"
                            className="ml-auto text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Download
                          </a>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Published by:</strong> Administrator
                </p>
                <p>
                  <strong>Visibility:</strong>{" "}
                  {selectedAnnouncement.target === "all"
                    ? "All Users"
                    : selectedAnnouncement.target.charAt(0).toUpperCase() +
                      selectedAnnouncement.target.slice(1)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
              onClick={() => setShowViewModal(false)}
            >
              Close
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center"
              onClick={() => {
                setShowViewModal(false);
                handleEditAnnouncement(selectedAnnouncement);
              }}
            >
              <Edit size={16} className="mr-1" />
              Edit
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">
            Important Announcements
          </h3>
          <button
            className="bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 flex items-center text-sm"
            onClick={handleNewAnnouncement}
          >
            <AlertTriangle size={16} className="mr-1" />
            New Announcement
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent Only</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className={`p-4 rounded-lg border ${
                  announcement.priority === "urgent"
                    ? "bg-red-50 border-red-200"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4
                      className={`font-medium ${
                        announcement.priority === "urgent"
                          ? "text-red-800"
                          : "text-gray-800"
                      }`}
                    >
                      {announcement.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {announcement.content &&
                        announcement.content.substring(0, 150)}
                      {announcement.content && announcement.content.length > 150
                        ? "..."
                        : ""}
                    </p>
                  </div>
                  <div>{getPriorityBadge(announcement.priority)}</div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-3">
                      {announcement.date}
                    </span>
                    {getTargetBadge(announcement.target)}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      onClick={() => handleViewAnnouncement(announcement)}
                    >
                      <Eye size={16} className="mr-1" />
                      View
                    </button>
                    <button
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      onClick={() => handleEditAnnouncement(announcement)}
                    >
                      <Edit size={16} className="mr-1" />
                      Edit
                    </button>
                    <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                      <Send size={16} className="mr-1" />
                      Push Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 border rounded-lg">
              <p className="text-gray-500">No announcements found</p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t">
          <h4 className="font-medium text-gray-700 mb-2">
            Announcement Templates
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div
              className="border rounded p-2 text-center text-sm cursor-pointer hover:bg-red-50 flex items-center justify-center"
              onClick={() => handleTemplateSelect("exam")}
            >
              <FileText size={14} className="mr-1" />
              Exam Schedule
            </div>
            <div
              className="border rounded p-2 text-center text-sm cursor-pointer hover:bg-red-50 flex items-center justify-center"
              onClick={() => handleTemplateSelect("emergency")}
            >
              <AlertTriangle size={14} className="mr-1" />
              Emergency Notice
            </div>
            <div
              className="border rounded p-2 text-center text-sm cursor-pointer hover:bg-red-50 flex items-center justify-center"
              onClick={() => handleTemplateSelect("event")}
            >
              <Bell size={14} className="mr-1" />
              Event Reminder
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Announcement Analytics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {announcements.length}
            </div>
            <div className="text-sm text-blue-800">Total Announcements</div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <div className="text-3xl font-bold text-red-600 mb-1">
              {announcements.filter((a) => a.priority === "urgent").length}
            </div>
            <div className="text-sm text-red-800">Urgent Announcements</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="text-3xl font-bold text-green-600 mb-1">92%</div>
            <div className="text-sm text-green-800">Read Rate</div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="text-3xl font-bold text-purple-600 mb-1">18</div>
            <div className="text-sm text-purple-800">Recipients Reached</div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-2">
            Announcement Engagement
          </h4>
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Students</span>
                  <span className="text-sm text-gray-500">95%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "95%" }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Teachers</span>
                  <span className="text-sm text-gray-500">100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: "100%" }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Parents</span>
                  <span className="text-sm text-gray-500">82%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: "82%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2">Recent Activity</h4>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Announcement
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Delivered
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Read
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      Final Exam Schedule
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">Apr 28, 2025</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">452/455</div>
                    <div className="text-xs text-green-600">99.3%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">436/452</div>
                    <div className="text-xs text-green-600">96.4%</div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      School Closure Notice
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">Apr 26, 2025</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">455/455</div>
                    <div className="text-xs text-green-600">100%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">448/455</div>
                    <div className="text-xs text-green-600">98.5%</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Announcement Modal */}
      {renderAnnouncementModal()}

      {/* View Announcement Modal */}
      {renderViewModal()}
    </div>
  );
};

export default AnnouncementsManager;
