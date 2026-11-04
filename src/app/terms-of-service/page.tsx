export default function TermsOfService() {
  return (
    <article className="container mx-auto px-6 py-24 max-w-4xl pt-32">
      <h1 className="text-4xl font-bold tracking-tighter mb-4">
        Terms of Service
      </h1>
      <p className="text-sm text-gray-500 mb-12">Last Updated: November 2026</p>

      <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            1. Acceptance of Terms
          </h2>
          <p>
            {`By accessing or using the forma 3D configurator and associated services (the "Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.`}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            2. Use License
          </h2>
          <p className="mb-4">
            {`Permission is granted to temporarily download one copy of the materials (information or software) on forma's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:`}
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{`Modify or copy the 3D models, textures, or source code;`}</li>
            <li>
              {`Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);`}
            </li>
            <li>
              {`Attempt to decompile or reverse engineer any software contained on forma's website;`}
            </li>
            <li>
              {`Remove any copyright or other proprietary notations from the materials; or`}
            </li>
            <li>
              {`Transfer the materials to another person or "mirror" the materials on any other server.`}
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            3. User Accounts
          </h2>
          <p>
            {`When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.`}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            4. Configurator Accuracy
          </h2>
          <p>
            {`While we strive for photorealistic accuracy in our 3D configurator, the final physical product may differ slightly in color, texture, or finish due to screen calibration, rendering approximations, and manufacturing tolerances. The 3D representations are strictly for visualization purposes.`}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            5. Disclaimer
          </h2>
          <p>
            {`The materials on forma's website are provided on an 'as is' basis. forma makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.`}
          </p>
        </section>
      </div>
    </article>
  );
}
