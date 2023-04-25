import React, { useState } from "react";
import axios from "axios";

const UserInfo = ({ userData, onClose, setWs, setId, setUsername }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showDialog, setShowDialog] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const user = userData.data;

  const handleChangePassword = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to change your password?"
    );
    if (confirmed) {
      try {
        const response = await axios.post("/user/change-password", {
          userId: user._id,
          oldPassword,
          newPassword,
          confirmPassword,
        });
        setMessage(response.data.message);
      } catch (error) {
        setMessage(error.response.data.message);
      }
    } else {
    }
  };

  function logout() {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );
    if (confirmed) {
      axios.post("/logout").then(() => {
        setWs(null);
        setId(null);
        setUsername(null);
      });
    }else{

    }
  }

  const handleCloseDialog = () => {
    setMessage("");
    onClose();
    setShowDialog(false);
  };

  return (
    <div>
      {showDialog && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
            <button
              className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-700"
              onClick={handleCloseDialog}
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <h2 className="text-lg font-bold mb-4">User Information</h2>
            <div className="mb-4">
              <p>
                <span className="font-bold">User ID:</span> {user._id}
              </p>
              <p>
                <span className="font-bold">Username:</span> {user.username}
              </p>
            </div>
            {showChangePassword ? (
              <>
                <div className="mb-4">
                  <label
                    htmlFor="old-password"
                    className="block font-bold mb-2"
                  >
                    Old Password:
                  </label>
                  <input
                    type="password"
                    id="old-password"
                    className="w-full border border-gray-300 p-2 rounded"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="new-password"
                    className="block font-bold mb-2"
                  >
                    New Password:
                  </label>
                  <input
                    type="password"
                    id="new-password"
                    className="w-full border border-gray-300 p-2 rounded"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="confirm-password"
                    className="block font-bold mb-2"
                  >
                    Confirm Password:
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    className="w-full border border-gray-300 p-2 rounded"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleChangePassword}
                >
                  Change Password
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex mb-6"
                  onClick={() => setShowChangePassword(true)}
                >
                  Change Password
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 ml-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                    />
                  </svg>
                </button>
                <button
                  onClick={logout}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex"
                >
                  Log Out
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 ml-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                    />
                  </svg>
                </button>
              </div>
            )}
            <p className="text-red-500 mt-4">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
