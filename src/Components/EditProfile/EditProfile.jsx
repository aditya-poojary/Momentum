import React from "react";

function EditProfile() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Edit Your Profile</h1>
      <form className="w-full max-w-md space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Username:</label>
          <input
            type="text"
            placeholder="Update your username"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#152d46]"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#152d46] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#152d90] transition duration-300"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditProfile;