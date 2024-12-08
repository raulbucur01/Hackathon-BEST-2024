const GdprPage = () => {
  return (
    <div className="container mx-auto p-6 bg-gray-900 text-white">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-indigo-500">
        GDPR Privacy Policy
      </h1>
      <div className="text-lg max-h-[80vh] overflow-y-auto p-6 bg-gray-800 rounded-lg shadow-lg custom-scrollbar">
        <p className="mb-4">
          This privacy policy explains how we collect, use, and protect your
          personal data in accordance with the General Data Protection
          Regulation (GDPR). Please read the following carefully.
        </p>
        <h2 className="text-2xl font-semibold mb-2 text-indigo-400">
          1. Introduction
        </h2>
        <p className="mb-4">
          We are committed to protecting your privacy and ensuring that your
          personal information is handled in a safe and responsible manner. In
          this policy, we outline the types of personal data we collect, how we
          use it, and the rights you have in relation to your data.
        </p>
        <h2 className="text-2xl font-semibold mb-2 text-indigo-400">
          2. Data Collection
        </h2>
        <p className="mb-4">
          We collect various types of personal data, including:
          <ul className="list-disc pl-5">
            <li>Identification details (e.g., name, email, phone number)</li>
            <li>Health-related information (e.g., allergies, conditions)</li>
            <li>
              Usage data (e.g., browser, IP address, actions on our website)
            </li>
          </ul>
        </p>
        <h2 className="text-2xl font-semibold mb-2 text-indigo-400">
          3. How We Use Your Data
        </h2>
        <p className="mb-4">
          We use your data to: Provide you with personalized services,
          Communicate with you about your account, Improve our website and
          services.
        </p>
        <h2 className="text-2xl font-semibold mb-2 text-indigo-400">
          4. Your Rights
        </h2>
        <p className="mb-4">
          Under the GDPR, you have the following rights: Right to access your
          data, Right to rectify inaccurate data, Right to erase data (the
          "right to be forgotten"), Right to restrict data processing.
        </p>
        <p>
          If you have any questions about how we handle your personal data,
          please contact us at privacy@example.com.
        </p>
      </div>
    </div>
  );
};

export default GdprPage;
