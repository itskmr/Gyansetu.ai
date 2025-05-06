// File: components/TableActions.jsx
import React from "react";

const TableActions = ({ activeTab, status }) => {
  return (
    <div className="flex space-x-2">
      {activeTab === "upcoming" ? (
        <>
          <button className="text-blue-600 hover:text-blue-800">Edit</button>
          {status === "draft" && (
            <button className="text-green-600 hover:text-green-800">
              Publish
            </button>
          )}
          <button className="text-red-600 hover:text-red-800">Cancel</button>
        </>
      ) : (
        <>
          <button className="text-blue-600 hover:text-blue-800">View</button>
          <button className="text-green-600 hover:text-green-800">Clone</button>
        </>
      )}
    </div>
  );
};

export default TableActions;
