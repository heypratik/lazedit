import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="bg-black text-white min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
        
        <div className="space-y-8">
          <div>
            <p className="text-lg mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <p className="text-lg mb-6">
              LazeEdit ("we," "our," or "us") operates the LazeEdit AI image editing service (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <h3 className="text-xl font-medium mb-3">Personal Information</h3>
            <p className="mb-4">
              We may collect personal information that you voluntarily provide to us when you register for an account, use our Service, or contact us. This may include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Name and email address</li>
              <li>Account credentials</li>
              <li>Payment information (processed by third-party payment processors)</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">Usage Information</h3>
            <p className="mb-4">
              We automatically collect certain information when you use our Service:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage patterns and interaction data</li>
              <li>Log files and technical data</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">Image Data</h3>
            <p className="mb-6">
              When you upload images to our Service, we temporarily process and store these images to provide our AI editing services. We do not retain your images longer than necessary to complete the requested editing operations.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Provide, maintain, and improve our Service</li>
              <li>Process your transactions and manage your account</li>
              <li>Communicate with you about your account and our Service</li>
              <li>Provide customer support</li>
              <li>Analyze usage patterns to improve our AI algorithms</li>
              <li>Comply with legal obligations</li>
              <li>Protect against fraud and security threats</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Information Sharing and Disclosure</h2>
            <p className="mb-4">We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>With service providers who assist us in operating our Service</li>
              <li>When required by law or to protect our rights</li>
              <li>In connection with a business transfer or acquisition</li>
              <li>With your consent</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="mb-6">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is completely secure.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
            <p className="mb-6">
              We retain your personal information for as long as necessary to provide our Service and comply with our legal obligations. Images uploaded for editing are typically deleted within 24 hours of processing unless you save them to your account.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="mb-4">Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
              <li>Data portability</li>
              <li>Withdraw consent</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking Technologies</h2>
            <p className="mb-6">
              We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. You can control cookie preferences through your browser settings.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <p className="mb-6">
              Our Service may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these third parties.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
            <p className="mb-6">
              Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">International Data Transfers</h2>
            <p className="mb-6">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
            <p className="mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="mb-6">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-lg">
              Email: <a href="mailto:lazedit@gmail.com" className="text-orange-400 hover:text-orange-300">lazedit@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}