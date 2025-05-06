import React from "react";
import { X, Plus, Target, FileText, Link, Upload } from "lucide-react";

export default function ProjectContent({ assignment, setAssignment }) {
  // Project-specific handlers
  const handleAddLearningObjective = () => {
    setAssignment({
      ...assignment,
      learningObjectives: [...assignment.learningObjectives, ""],
    });
  };

  const handleLearningObjectiveChange = (index, value) => {
    const updatedObjectives = [...assignment.learningObjectives];
    updatedObjectives[index] = value;

    setAssignment({
      ...assignment,
      learningObjectives: updatedObjectives,
    });
  };

  const handleRemoveLearningObjective = (index) => {
    const updatedObjectives = [...assignment.learningObjectives];
    updatedObjectives.splice(index, 1);

    setAssignment({
      ...assignment,
      learningObjectives: updatedObjectives,
    });
  };

  const handleAddResource = () => {
    setAssignment({
      ...assignment,
      resources: [...assignment.resources, { title: "", link: "" }],
    });
  };

  const handleResourceChange = (index, field, value) => {
    const updatedResources = [...assignment.resources];
    updatedResources[index] = {
      ...updatedResources[index],
      [field]: value,
    };

    setAssignment({
      ...assignment,
      resources: updatedResources,
    });
  };

  const handleRemoveResource = (index) => {
    const updatedResources = [...assignment.resources];
    updatedResources.splice(index, 1);

    setAssignment({
      ...assignment,
      resources: updatedResources,
    });
  };

  const handleAddDeliverable = () => {
    setAssignment({
      ...assignment,
      deliverables: [
        ...assignment.deliverables,
        { description: "", points: 10 },
      ],
    });
  };

  const handleDeliverableChange = (index, field, value) => {
    const updatedDeliverables = [...assignment.deliverables];
    updatedDeliverables[index] = {
      ...updatedDeliverables[index],
      [field]: value,
    };

    setAssignment({
      ...assignment,
      deliverables: updatedDeliverables,
    });
  };

  const handleRemoveDeliverable = (index) => {
    const updatedDeliverables = [...assignment.deliverables];
    updatedDeliverables.splice(index, 1);

    setAssignment({
      ...assignment,
      deliverables: updatedDeliverables,
    });
  };

  const handleAddMilestone = () => {
    setAssignment({
      ...assignment,
      milestones: [
        ...assignment.milestones,
        { title: "", dueDate: "", description: "" },
      ],
    });
  };

  const handleMilestoneChange = (index, field, value) => {
    const updatedMilestones = [...assignment.milestones];
    updatedMilestones[index] = {
      ...updatedMilestones[index],
      [field]: value,
    };

    setAssignment({
      ...assignment,
      milestones: updatedMilestones,
    });
  };

  const handleRemoveMilestone = (index) => {
    const updatedMilestones = [...assignment.milestones];
    updatedMilestones.splice(index, 1);

    setAssignment({
      ...assignment,
      milestones: updatedMilestones,
    });
  };

  return (
    <div className="mb-10">
      <div className="mb-8 bg-purple-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-purple-700 flex items-center">
          <span className="bg-purple-200 text-purple-800 w-6 h-6 rounded-full mr-2 flex items-center justify-center text-sm font-bold">
            2
          </span>
          Project Type
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              assignment.projectType === "individual"
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 hover:border-purple-300"
            }`}
            onClick={() =>
              setAssignment({ ...assignment, projectType: "individual" })
            }
          >
            <div className="flex items-center">
              <div className="mr-3">
                <input
                  type="radio"
                  checked={assignment.projectType === "individual"}
                  onChange={() => {}}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">
                  Individual Project
                </h4>
                <p className="text-sm text-gray-600">
                  Students work independently on their own project
                </p>
              </div>
            </div>
          </div>

          <div
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              assignment.projectType === "group"
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 hover:border-purple-300"
            }`}
            onClick={() =>
              setAssignment({ ...assignment, projectType: "group" })
            }
          >
            <div className="flex items-center">
              <div className="mr-3">
                <input
                  type="radio"
                  checked={assignment.projectType === "group"}
                  onChange={() => {}}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Group Project</h4>
                <p className="text-sm text-gray-600">
                  Students collaborate in teams on a shared project
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="mb-8 bg-purple-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-purple-700 flex items-center">
            <span className="bg-purple-200 text-purple-800 w-6 h-6 rounded-full mr-2 flex items-center justify-center text-sm font-bold">
              3
            </span>
            Learning Objectives
          </h3>
          <button
            onClick={handleAddLearningObjective}
            className="flex items-center px-3 py-1 bg-purple-200 text-purple-700 rounded hover:bg-purple-300 transition-colors duration-200 text-sm"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Objective
          </button>
        </div>

        {assignment.learningObjectives.map((objective, index) => (
          <div key={index} className="mb-3 flex items-center">
            <div className="bg-white p-3 rounded-lg border border-purple-100 flex-grow shadow-sm">
              <div className="flex items-center">
                <Target className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  value={objective}
                  onChange={(e) =>
                    handleLearningObjectiveChange(index, e.target.value)
                  }
                  className="w-full border-none focus:ring-0 text-sm"
                  placeholder="Enter learning objective"
                />
              </div>
            </div>
            <button
              onClick={() => handleRemoveLearningObjective(index)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {assignment.learningObjectives.length === 0 && (
          <div className="text-sm text-gray-500 italic">
            Add learning objectives that students will achieve through this
            project
          </div>
        )}
      </div>

      {/* Project Resources */}
      <div className="mb-8 bg-purple-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-purple-700 flex items-center">
            <span className="bg-purple-200 text-purple-800 w-6 h-6 rounded-full mr-2 flex items-center justify-center text-sm font-bold">
              4
            </span>
            Project Resources
          </h3>
          <button
            onClick={handleAddResource}
            className="flex items-center px-3 py-1 bg-purple-200 text-purple-700 rounded hover:bg-purple-300 transition-colors duration-200 text-sm"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Resource
          </button>
        </div>

        {assignment.resources.map((resource, index) => (
          <div key={index} className="mb-3 flex items-start">
            <div className="bg-white p-3 rounded-lg border border-purple-100 flex-grow shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    value={resource.title}
                    onChange={(e) =>
                      handleResourceChange(index, "title", e.target.value)
                    }
                    className="w-full border-none focus:ring-0 text-sm"
                    placeholder="Resource title"
                  />
                </div>
                <div className="flex items-center">
                  <Link className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    value={resource.link}
                    onChange={(e) =>
                      handleResourceChange(index, "link", e.target.value)
                    }
                    className="w-full border-none focus:ring-0 text-sm"
                    placeholder="URL or location"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => handleRemoveResource(index)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {assignment.resources.length === 0 && (
          <div className="text-sm text-gray-500 italic">
            Add helpful resources that students can use for this project
          </div>
        )}
      </div>

      {/* Deliverables */}
      <div className="mb-8 bg-purple-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-purple-700 flex items-center">
            <span className="bg-purple-200 text-purple-800 w-6 h-6 rounded-full mr-2 flex items-center justify-center text-sm font-bold">
              5
            </span>
            Project Deliverables
          </h3>
          <button
            onClick={handleAddDeliverable}
            className="flex items-center px-3 py-1 bg-purple-200 text-purple-700 rounded hover:bg-purple-300 transition-colors duration-200 text-sm"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Deliverable
          </button>
        </div>

        {assignment.deliverables.map((deliverable, index) => (
          <div key={index} className="mb-3 flex items-start">
            <div className="bg-white p-3 rounded-lg border border-purple-100 flex-grow shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-3 flex items-center">
                  <Upload className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    value={deliverable.description}
                    onChange={(e) =>
                      handleDeliverableChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    className="w-full border-none focus:ring-0 text-sm"
                    placeholder="Deliverable description"
                  />
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-2">Points:</span>
                  <input
                    type="number"
                    value={deliverable.points}
                    onChange={(e) =>
                      handleDeliverableChange(index, "points", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                    min="0"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => handleRemoveDeliverable(index)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {assignment.deliverables.length === 0 && (
          <div className="text-sm text-gray-500 italic">
            Add required deliverables that students must submit
          </div>
        )}
      </div>

      {/* Milestones */}
      <div className="mb-8 bg-purple-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-purple-700 flex items-center">
            <span className="bg-purple-200 text-purple-800 w-6 h-6 rounded-full mr-2 flex items-center justify-center text-sm font-bold">
              6
            </span>
            Project Milestones (Optional)
          </h3>
          <button
            onClick={handleAddMilestone}
            className="flex items-center px-3 py-1 bg-purple-200 text-purple-700 rounded hover:bg-purple-300 transition-colors duration-200 text-sm"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Milestone
          </button>
        </div>

        {assignment.milestones.map((milestone, index) => (
          <div
            key={index}
            className="mb-4 p-4 bg-white rounded-lg border border-purple-100 shadow-sm"
          >
            <div className="flex justify-between mb-2">
              <h4 className="font-medium text-purple-700">
                Milestone {index + 1}
              </h4>
              <button
                onClick={() => handleRemoveMilestone(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={milestone.title}
                  onChange={(e) =>
                    handleMilestoneChange(index, "title", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-sm"
                  placeholder="Milestone title"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={milestone.dueDate}
                  onChange={(e) =>
                    handleMilestoneChange(index, "dueDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Description
              </label>
              <textarea
                value={milestone.description}
                onChange={(e) =>
                  handleMilestoneChange(index, "description", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-sm"
                rows="2"
                placeholder="Describe what should be completed by this milestone"
              ></textarea>
            </div>
          </div>
        ))}

        {assignment.milestones.length === 0 && (
          <div className="text-sm text-gray-500 italic">
            Add project milestones to help students track their progress
          </div>
        )}
      </div>
    </div>
  );
}
