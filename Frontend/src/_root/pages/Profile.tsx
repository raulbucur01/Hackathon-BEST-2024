import React from "react";

const Profile = () => {
  return (
    <div className="min-h-screen bg-dm-dark py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-dm-dark-2 shadow-md rounded-lg p-6">
        {/* Profile Header */}
        <div className="flex items-center space-x-6 mb-6">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile Picture"
            className="w-32 h-32 rounded-full object-cover"
          />
          <div>
            <h1 className="text-3xl font-semibold text-dm-light">John Doe</h1>
            <p className="text-lg text-dm-accent">Software Developer</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-dm-light mb-2">
            About Me
          </h2>
          <p className="text-dm-light">
            I'm a passionate software developer with a focus on front-end
            technologies. I enjoy building user-centric applications and
            collaborating with teams to deliver high-quality products.
          </p>
        </div>

        {/* Contact Information */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-dm-light mb-2">
            Contact Information
          </h2>
          <ul className="text-dm-light">
            <li>Email: johndoe@example.com</li>
            <li>Phone: +123 456 7890</li>
            <li>Location: San Francisco, CA</li>
          </ul>
        </div>

        {/* Edit Profile Button */}
        <div className="text-center">
          <button className="px-6 py-2 bg-dm-primary text-dm-light rounded-md hover:bg-dm-secondary transition-colors">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
