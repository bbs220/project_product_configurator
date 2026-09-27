export default function PrivacyPolicy() {
  return (
    <main className="container mx-auto px-6 py-24 max-w-4xl pt-32">
      <h1 className="text-4xl font-bold tracking-tighter mb-4">
        Privacy Policy
      </h1>
      <p className="text-sm text-gray-500 mb-12">Last Updated: October 2026</p>

      <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            1. Introduction
          </h2>
          <p>
            {`Welcome to forma ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.`}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            2. The Data We Collect About You
          </h2>
          <p className="mb-4">
            {`Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:`}
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Identity Data:</strong>{" "}
              {`includes first name, last name, username or similar identifier.`}
            </li>
            <li>
              <strong>Contact Data:</strong>{" "}
              {`includes email address and telephone numbers.`}
            </li>
            <li>
              <strong>Configuration Data:</strong>{" "}
              {`includes your saved 3D model configurations, preferences, and design choices made within our application.`}
            </li>
            <li>
              <strong>Technical Data:</strong>{" "}
              {`includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.`}
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            3. How We Use Your Personal Data
          </h2>
          <p>
            {`We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances: where we need to perform the contract we are about to enter into or have entered into with you; where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests; and where we need to comply with a legal obligation.`}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            4. Data Security
          </h2>
          <p>
            {`We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.`}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            5. Contact Us
          </h2>
          <p>
            {`If you have any questions about this privacy policy or our privacy practices, please contact us at privacy@forma.design.`}
          </p>
        </section>
      </div>
    </main>
  );
}
