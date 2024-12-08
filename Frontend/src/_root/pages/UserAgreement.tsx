const UserAgreement = () => {
  return (
    <div className="container mx-auto p-6 bg-gray-900 text-white">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-indigo-500">
        User Agreement
      </h1>
      <div className="text-lg max-h-[80vh] overflow-y-auto p-6 bg-gray-800 rounded-lg shadow-lg custom-scrollbar">
        <p className="mb-4">
          Welcome to our platform! Please read the following User Agreement
          carefully. By using our services, you agree to the terms and
          conditions outlined below.
        </p>
        <h2 className="text-2xl font-semibold mb-2 text-indigo-400">
          1. Introduction
        </h2>
        <p className="mb-4">
          The following User Agreement governs your access to and use of our
          website and services. This agreement outlines your rights and
          responsibilities, and our policies regarding the use of our platform.
        </p>
        <h2 className="text-2xl font-semibold mb-2 text-indigo-400">
          2. User Responsibilities
        </h2>
        <p className="mb-4">
          As a user of our platform, you agree to: Provide accurate and complete
          information when registering, Keep your account details confidential,
          and Comply with all applicable laws and regulations.
        </p>
        <h2 className="text-2xl font-semibold mb-2 text-indigo-400">
          3. Service Usage
        </h2>
        <p className="mb-4">
          Our services are provided "as is" and "as available." We do not
          guarantee uninterrupted access to our platform. You agree to use the
          services responsibly and in accordance with the terms outlined in this
          agreement.
        </p>
        <h2 className="text-2xl font-semibold mb-2 text-indigo-400">
          4. Termination of Account
        </h2>
        <p className="mb-4">
          We reserve the right to suspend or terminate your account if you
          violate the terms of this agreement. In the event of termination, you
          will lose access to your account and any associated data.
        </p>
        <h2 className="text-2xl font-semibold mb-2 text-indigo-400">
          5. Limitations of Liability
        </h2>
        <p className="mb-4">
          We are not liable for any damages arising from the use of our
          platform, including but not limited to loss of data, system errors, or
          third-party claims.
        </p>
        <p>
          For any questions or clarifications, please contact us at
          support@example.com.
        </p>
      </div>
    </div>
  );
};

export default UserAgreement;
