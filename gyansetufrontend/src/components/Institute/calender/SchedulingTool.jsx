import React, { useState } from "react";
import {
  Plus,
  Send,
  Upload,
  Clock,
  Calendar,
  Bell,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";

const SchedulingTools = ({ scheduledNotifications, onAddNotification }) => {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [sentNotifications, setSentNotifications] = useState([
    {
      id: 901,
      title: "Parent-Teacher Conference",
      date: "2025-04-25",
      target: ["parents", "teachers"],
      priority: "high",
      message: "Reminder for upcoming conference schedule",
    },
    {
      id: 902,
      title: "Exam Preparation Guide",
      date: "2025-04-22",
      target: ["students"],
      priority: "medium",
      message: "Study materials and tips for final exams",
    },
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Form state for new notification
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
    date: "",
    target: {
      students: false,
      teachers: false,
      parents: false,
      admin: false,
    },
    priority: "medium",
    attachments: [],
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("target.")) {
      const targetGroup = name.split(".")[1];
      setNotificationForm((prev) => ({
        ...prev,
        target: {
          ...prev.target,
          [targetGroup]: checked,
        },
      }));
    } else {
      setNotificationForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle submit notification
  const handleSubmitNotification = () => {
    const targetGroups = Object.entries(notificationForm.target)
      .filter(([_, selected]) => selected)
      .map(([group]) => group);

    const newNotification = {
      title: notificationForm.title,
      message: notificationForm.message,
      date: notificationForm.date,
      target: targetGroups,
      priority: notificationForm.priority,
    };

    onAddNotification(newNotification);
    setShowNotificationModal(false);
  };

  // Handle new schedule click
  const handleNewSchedule = () => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    setNotificationForm({
      title: "",
      message: "",
      date: formattedDate,
      target: {
        students: false,
        teachers: false,
        parents: false,
        admin: false,
      },
      priority: "medium",
      attachments: [],
    });

    setShowNotificationModal(true);
  };

  // Handle template selection
  const handleTemplateSelect = (template) => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    switch (template) {
      case "fee":
        setNotificationForm({
          title: "Monthly Fee Reminder",
          message:
            "This is a reminder that the monthly school fees are due by the 5th of the month. Please ensure timely payment to avoid any late fees.",
          date: formattedDate,
          target: {
            students: false,
            teachers: false,
            parents: true,
            admin: false,
          },
          priority: "high",
          attachments: [],
        });
        break;
      case "exam":
        setNotificationForm({
          title: "Exam Schedule Released",
          message:
            "The final examination schedule has been released. Please check the academic calendar for your specific exam dates and times.",
          date: formattedDate,
          target: {
            students: true,
            teachers: true,
            parents: true,
            admin: false,
          },
          priority: "high",
          attachments: [],
        });
        break;
      case "holiday":
        setNotificationForm({
          title: "Upcoming School Holiday",
          message:
            "Please note that the school will be closed on [DATE] due to [HOLIDAY]. Regular classes will resume on the following day.",
          date: formattedDate,
          target: {
            students: true,
            teachers: true,
            parents: true,
            admin: true,
          },
          priority: "medium",
          attachments: [],
        });
        break;
      case "meeting":
        setNotificationForm({
          title: "Staff Meeting Reminder",
          message:
            "This is a reminder that there will be a staff meeting on [DATE] at [TIME] in the conference room. Attendance is mandatory.",
          date: formattedDate,
          target: {
            students: false,
            teachers: true,
            parents: false,
            admin: true,
          },
          priority: "medium",
          attachments: [],
        });
        break;
      default:
        break;
    }

    setSelectedTemplate(template);
    setShowNotificationModal(true);
  };

  // Render notification modal
  const renderNotificationModal = () => {
    if (!showNotificationModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              Schedule New Notification
            </h3>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowNotificationModal(false)}
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
                value={notificationForm.title}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter notification title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={notificationForm.message}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Enter notification message"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Audience
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="target.students"
                      checked={notificationForm.target.students}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm">Students</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="target.teachers"
                      checked={notificationForm.target.teachers}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm">Teachers</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="target.parents"
                      checked={notificationForm.target.parents}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm">Parents</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="target.admin"
                      checked={notificationForm.target.admin}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm">Administration</span>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Schedule Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={notificationForm.date}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={notificationForm.priority}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
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
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
              onClick={() => setShowNotificationModal(false)}
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
              Save as Draft
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              onClick={handleSubmitNotification}
            >
              Schedule
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Get target audience badge
  const getTargetBadge = (target) => {
    if (Array.isArray(target)) {
      return (
        <div className="flex flex-wrap gap-1">
          {target.includes("students") && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              Students
            </span>
          )}
          {target.includes("teachers") && (
            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
              Teachers
            </span>
          )}
          {target.includes("parents") && (
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
              Parents
            </span>
          )}
          {target.includes("admin") && (
            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
              Admin
            </span>
          )}
        </div>
      );
    }

    // For backward compatibility with older notification format
    return (
      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
        {target}
      </span>
    );
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

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">Create Schedule</h3>
          <button
            className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 flex items-center text-sm"
            onClick={handleNewSchedule}
          >
            <Plus size={16} className="mr-1" />
            New Schedule
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-2">
              Upcoming Scheduled Notifications
            </h4>
            <div className="space-y-3">
              {scheduledNotifications.length > 0 ? (
                scheduledNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-3 bg-blue-50 rounded-md"
                  >
                    <div className="flex justify-between">
                      <h5 className="font-medium text-sm">
                        {notification.title}
                      </h5>
                      <span className="text-xs text-gray-500">
                        {notification.date}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        {getTargetBadge(notification.target)}
                        {getPriorityBadge(notification.priority)}
                      </div>
                      <div className="flex space-x-1">
                        <button
                          className="p-1 text-gray-500 hover:text-blue-600"
                          title="Edit"
                        >
                          <Clock size={14} />
                        </button>
                        <button
                          className="p-1 text-gray-500 hover:text-red-600"
                          title="Cancel"
                        >
                          <X size={14} />
                        </button>
                        <button
                          className="p-1 text-gray-500 hover:text-green-600"
                          title="Send now"
                        >
                          <Send size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No scheduled notifications
                </div>
              )}
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-2">Recently Sent</h4>
            <div className="space-y-3">
              {sentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex justify-between">
                    <h5 className="font-medium text-sm">
                      {notification.title}
                    </h5>
                    <span className="text-xs text-gray-500">
                      {notification.date}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <div className="flex items-center mt-2">
                    {getTargetBadge(notification.target)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 border-t pt-4">
          <h4 className="font-medium text-gray-700 mb-2">Quick Templates</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div
              className="border rounded p-2 text-center text-sm cursor-pointer hover:bg-blue-50"
              onClick={() => handleTemplateSelect("fee")}
            >
              Fee Reminder
            </div>
            <div
              className="border rounded p-2 text-center text-sm cursor-pointer hover:bg-blue-50"
              onClick={() => handleTemplateSelect("exam")}
            >
              Exam Schedule
            </div>
            <div
              className="border rounded p-2 text-center text-sm cursor-pointer hover:bg-blue-50"
              onClick={() => handleTemplateSelect("holiday")}
            >
              Holiday Notice
            </div>
            <div
              className="border rounded p-2 text-center text-sm cursor-pointer hover:bg-blue-50"
              onClick={() => handleTemplateSelect("meeting")}
            >
              Staff Meeting
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Notification Analytics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {scheduledNotifications.length}
            </div>
            <div className="text-sm text-blue-800">Scheduled Notifications</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {sentNotifications.length}
            </div>
            <div className="text-sm text-green-800">Sent Notifications</div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="text-3xl font-bold text-purple-600 mb-1">87%</div>
            <div className="text-sm text-purple-800">Average Open Rate</div>
          </div>
        </div>

        <h4 className="font-medium text-gray-700 mb-2">
          Notification Distribution
        </h4>
        <div className="border rounded-lg p-4 mb-4">
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">24</div>
              <div className="text-xs text-gray-600">Students</div>
              <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-lg font-semibold text-indigo-600">18</div>
              <div className="text-xs text-gray-600">Teachers</div>
              <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                <div
                  className="bg-indigo-500 h-2 rounded-full"
                  style={{ width: "45%" }}
                ></div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600">32</div>
              <div className="text-xs text-gray-600">Parents</div>
              <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: "80%" }}
                ></div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-lg font-semibold text-gray-600">6</div>
              <div className="text-xs text-gray-600">Admin</div>
              <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                <div
                  className="bg-gray-500 h-2 rounded-full"
                  style={{ width: "15%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <h4 className="font-medium text-gray-700 mb-2">Recent Activity</h4>
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Activity
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
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    Exam Schedule sent to Students
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">Apr 22, 2025</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    Fee Reminder scheduled for Parents
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">Apr 25, 2025</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    Scheduled
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    Parent-Teacher Conference sent
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">Apr 25, 2025</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Notification Modal */}
      {renderNotificationModal()}
    </div>
  );
};

export default SchedulingTools;
