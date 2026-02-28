export default function PrivacyPolicy() {
  return (
    <div className="animate-fade-in-up">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-border p-6 sm:p-8 lg:p-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8 pb-6 border-b border-border">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-text mb-2">Privacy Policy</h1>
          <p className="text-sm text-text-secondary">PGME (PGME Medical Education LLP)</p>
          <p className="text-sm text-text-secondary">Effective Date: February 23, 2026 &bull; Last Updated: February 23, 2026</p>
        </div>

        <div className="prose prose-sm sm:prose max-w-none text-text-secondary leading-relaxed space-y-6">
          <p>PGME Medical Education LLP (&quot;PGME,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the PGME platform, including our mobile application and website (collectively, the &quot;Platform&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Platform. Please read this Privacy Policy carefully. By using the Platform, you agree to the collection and use of information in accordance with this policy.</p>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-text">1. Information We Collect</h2>

            <h3 className="text-sm sm:text-base font-semibold text-text">1.1 Personal Information</h3>
            <p>When you register for an account or use our services, we may collect the following personal information:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Identity Information:</strong> Full name, date of birth, gender</li>
              <li><strong>Contact Information:</strong> Phone number, email address</li>
              <li><strong>Educational Background:</strong> Undergraduate college/university, postgraduate college/university, current professional designation, current affiliated organisation</li>
              <li><strong>Address Information:</strong> Residential address, billing address, shipping address (for book orders)</li>
              <li><strong>Profile Information:</strong> Profile photograph</li>
              <li><strong>Payment Information:</strong> Transaction details processed through our payment partner (Zoho Payments). We do not store your credit/debit card numbers directly.</li>
            </ul>

            <h3 className="text-sm sm:text-base font-semibold text-text">1.2 Device Information</h3>
            <p>We automatically collect certain device information when you use the Platform:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Device Identifiers:</strong> Android ID or iOS Vendor Identifier</li>
              <li><strong>Device Details:</strong> Device brand, model, and operating system type</li>
              <li><strong>Network Information:</strong> Network connection status</li>
            </ul>

            <h3 className="text-sm sm:text-base font-semibold text-text">1.3 Location Information</h3>
            <p>With your explicit consent, we collect:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Precise Location:</strong> GPS coordinates (latitude and longitude) used for address auto-fill during profile setup and address selection</li>
              <li><strong>Address Data:</strong> Structured address components obtained through reverse geocoding via OpenStreetMap</li>
            </ul>
            <p>You can disable location access at any time through your device settings.</p>

            <h3 className="text-sm sm:text-base font-semibold text-text">1.4 Usage Information</h3>
            <p>We collect information about how you interact with the Platform:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Learning Activity:</strong> Video watch progress, document reading progress, module and course completion status, time spent on content</li>
              <li><strong>Session Activity:</strong> Live session attendance, meeting participation records</li>
              <li><strong>Purchase History:</strong> Subscription purchases, session purchases, book orders, payment status</li>
              <li><strong>Notification Activity:</strong> Notification delivery status, read/unread status</li>
            </ul>

            <h3 className="text-sm sm:text-base font-semibold text-text">1.5 Locally Stored Data</h3>
            <p>The following data is stored locally on your device:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Authentication Tokens:</strong> Encrypted access tokens and session identifiers stored in secure device storage</li>
              <li><strong>Downloaded Content:</strong> Video lectures and PDF documents downloaded for offline access, stored in a dedicated app directory</li>
              <li><strong>User Preferences:</strong> Theme settings, notification preferences, subject selections</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-text">2. How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Account Management:</strong> To create, maintain, and authenticate your account using phone-based OTP verification</li>
              <li><strong>Service Delivery:</strong> To provide access to courses, live sessions, study materials, and other educational content</li>
              <li><strong>Progress Tracking:</strong> To track and synchronise your learning progress across devices</li>
              <li><strong>Payment Processing:</strong> To process subscription payments, session purchases, and book orders through our payment partner</li>
              <li><strong>Order Fulfillment:</strong> To deliver physical books to your shipping address and provide order tracking</li>
              <li><strong>Communication:</strong> To send push notifications about class reminders, new content, purchase confirmations, and important announcements</li>
              <li><strong>Personalisation:</strong> To recommend content and send notifications based on your selected subjects and preferences</li>
              <li><strong>Device Management:</strong> To manage active sessions across multiple devices and provide secure access</li>
              <li><strong>Customer Support:</strong> To respond to your inquiries and provide technical assistance</li>
              <li><strong>Platform Improvement:</strong> To analyse usage patterns and improve our services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-text">3. Third-Party Services</h2>
            <p>We integrate the following third-party services that may collect or process your data:</p>

            <h3 className="text-sm sm:text-base font-semibold text-text">3.1 Firebase (Google)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Purpose:</strong> Push notification delivery (Firebase Cloud Messaging), app infrastructure</li>
              <li><strong>Data Shared:</strong> FCM device token, notification delivery data</li>
            </ul>

            <h3 className="text-sm sm:text-base font-semibold text-text">3.2 Zoho Payments</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Purpose:</strong> Secure payment processing for subscriptions, sessions, and book orders</li>
              <li><strong>Data Shared:</strong> Transaction amount, payment session identifiers</li>
            </ul>

            <h3 className="text-sm sm:text-base font-semibold text-text">3.3 Zoom Video Communications</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Purpose:</strong> Live interactive video sessions and classes</li>
              <li><strong>Data Shared:</strong> Meeting access credentials, participant information during sessions</li>
            </ul>

            <h3 className="text-sm sm:text-base font-semibold text-text">3.4 MSG91</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Purpose:</strong> OTP delivery for phone-based authentication</li>
              <li><strong>Data Shared:</strong> Phone number for OTP delivery</li>
            </ul>

            <h3 className="text-sm sm:text-base font-semibold text-text">3.5 OpenStreetMap (Nominatim)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Purpose:</strong> Reverse geocoding for address auto-fill</li>
              <li><strong>Data Shared:</strong> GPS coordinates for address lookup</li>
            </ul>

            <h3 className="text-sm sm:text-base font-semibold text-text">3.6 Amazon CloudFront (AWS)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Purpose:</strong> Content delivery network for streaming video lectures and serving media content</li>
              <li><strong>Data Shared:</strong> Standard web request data (IP address, user agent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-text">4. Data Storage and Security</h2>

            <h3 className="text-sm sm:text-base font-semibold text-text">4.1 Data Storage</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your personal information is stored on secure cloud servers</li>
              <li>Authentication tokens are stored in encrypted device storage (Android EncryptedSharedPreferences / iOS Keychain)</li>
              <li>Downloaded content is stored locally on your device in a private application directory</li>
              <li>All data transmission between the Platform and our servers is encrypted using HTTPS/TLS</li>
            </ul>

            <h3 className="text-sm sm:text-base font-semibold text-text">4.2 Security Measures</h3>
            <p>We implement appropriate technical and organisational measures to protect your personal information, including:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Encrypted data transmission (HTTPS/TLS)</li>
              <li>Encrypted local storage for sensitive data (tokens, credentials)</li>
              <li>JWT-based authentication with token refresh mechanism</li>
              <li>Session management with device-level access control</li>
              <li>Secure payment processing through PCI-compliant payment partners</li>
            </ul>

            <h3 className="text-sm sm:text-base font-semibold text-text">4.3 Data Retention</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>We retain your personal information for as long as your account is active or as needed to provide services</li>
              <li>Learning progress data is retained to enable continued access to your course history</li>
              <li>Payment records are retained as required by applicable financial regulations</li>
              <li>You may request deletion of your account and associated data at any time (see Section 7)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-text">5. Sharing of Information</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Service Providers:</strong> With third-party service providers who assist us in operating the Platform (as listed in Section 3), strictly for the purposes described</li>
              <li><strong>Payment Processing:</strong> With Zoho Payments to process your transactions securely</li>
              <li><strong>Legal Requirements:</strong> When required by law, regulation, legal process, or governmental request</li>
              <li><strong>Safety and Security:</strong> To protect the rights, property, or safety of PGME, our users, or the public</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, with appropriate notice to users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-text">6. Permissions</h2>
            <p>The Platform requests the following device permissions:</p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold text-text">Permission</th>
                    <th className="text-left py-2 font-semibold text-text">Purpose</th>
                  </tr>
                </thead>
                <tbody className="text-text-secondary">
                  <tr className="border-b border-border/50"><td className="py-2 pr-4 font-medium">Camera</td><td className="py-2">Required for live Zoom video sessions</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 pr-4 font-medium">Microphone</td><td className="py-2">Required for audio in live Zoom sessions</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 pr-4 font-medium">Location</td><td className="py-2">Address auto-fill during profile setup (optional)</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 pr-4 font-medium">Storage</td><td className="py-2">Downloading videos and documents for offline access</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 pr-4 font-medium">Notifications</td><td className="py-2">Receiving class reminders and important updates</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 pr-4 font-medium">Bluetooth</td><td className="py-2">Audio device connectivity during Zoom sessions</td></tr>
                  <tr><td className="py-2 pr-4 font-medium">Internet</td><td className="py-2">Core app functionality and content delivery</td></tr>
                </tbody>
              </table>
            </div>
            <p>All permissions are requested at the time of use and can be managed through your device settings.</p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-text">7. Your Rights and Choices</h2>
            <p>You have the following rights regarding your personal information:</p>

            <h3 className="text-sm sm:text-base font-semibold text-text">7.1 Access and Update</h3>
            <p>You can view and update your profile information at any time through the Edit Profile section in the Platform.</p>

            <h3 className="text-sm sm:text-base font-semibold text-text">7.2 Device Session Management</h3>
            <p>You can view all active sessions and remotely logout from any device through the Platform settings.</p>

            <h3 className="text-sm sm:text-base font-semibold text-text">7.3 Notification Preferences</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>You can manage notification preferences within the Platform settings</li>
              <li>You can disable push notifications through your device settings</li>
            </ul>

            <h3 className="text-sm sm:text-base font-semibold text-text">7.4 Location Access</h3>
            <p>You can enable or disable location access through your device settings at any time.</p>

            <h3 className="text-sm sm:text-base font-semibold text-text">7.5 Data Deletion</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>You may request complete deletion of your account and all associated personal data by contacting us at the email address provided below</li>
              <li>Upon receiving a valid deletion request, we will delete your personal data within 30 days, except where retention is required by law</li>
            </ul>

            <h3 className="text-sm sm:text-base font-semibold text-text">7.6 Data Download</h3>
            <p>You may request a copy of your personal data in a portable format by contacting us.</p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-text">8. Children&apos;s Privacy</h2>
            <p>The Platform is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children under 18 years of age. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information promptly.</p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-text">9. Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Posting the updated Privacy Policy within the Platform</li>
              <li>Sending a push notification about the update</li>
              <li>Updating the &quot;Last Updated&quot; date at the top of this policy</li>
            </ul>
            <p>Your continued use of the Platform after any changes constitutes your acceptance of the updated Privacy Policy.</p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-text">10. Data Transfer</h2>
            <p>Your information may be transferred to and processed on servers located outside your country of residence. By using the Platform, you consent to the transfer of your information to facilities maintained by us or our third-party service providers, where applicable data protection laws may differ from those in your jurisdiction.</p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-text">11. Cookies and Tracking</h2>
            <p>The Platform itself does not use browser cookies. However, our integrated WebView-based payment gateway (Zoho Payments) may use cookies or similar technologies as necessary for secure payment processing.</p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-text">12. Governing Law &amp; Jurisdiction</h2>
            <p>This policy shall be governed by the laws of India. All disputes shall be subject to the exclusive jurisdiction of courts located in Jalandhar, Punjab.</p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-text">13. Contact Us</h2>
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:</p>
            <p><strong>PGME Medical Education LLP</strong><br />Email: support@pgmemedicalteaching.com</p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-text">14. Grievance Officer</h2>
            <p>In accordance with applicable regulations, the details of the Grievance Officer are as follows:</p>
            <p>Name: [Grievance Officer Name]<br />Email: [grievance-officer-email@pgme.com]<br />Address: [Registered Office Address]</p>
            <p>Response time: We will acknowledge your grievance within 24 hours and resolve it within 15 days from the date of receipt.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
