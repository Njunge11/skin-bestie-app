import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ShieldCheck,
  Database,
  UserCheck,
  Share2,
  Lock,
  FileText,
  Cookie,
  Baby,
  RefreshCw,
  Mail,
} from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-skinbestie-primary" />
          <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
        </div>
        <p className="text-lg text-gray-600">
          Effective Date: September 22, 2025
        </p>
      </div>

      {/* Introduction Card */}
      <Card className="p-6 bg-gray-50 border-gray-200">
        <p className="text-base text-gray-700 leading-relaxed">
          At Skin Bestie, we respect your privacy and are committed to
          protecting the personal information you share with us. This policy
          explains what data we collect, how we use it, and the choices you
          have.
        </p>
      </Card>

      {/* Main Content Card */}
      <Card className="p-8">
        <div className="space-y-8">
          {/* Section 1 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Database className="h-5 w-5 text-skinbestie-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                1. Information We Collect
              </h2>
            </div>
            <p className="text-base text-gray-700 leading-relaxed mb-3">
              When you sign up and use Skin Bestie, we may collect the following
              information:
            </p>
            <ul className="space-y-2 ml-5 list-disc text-base text-gray-700 leading-relaxed">
              <li>
                <strong>Personal details</strong> – Name, email, phone number,
                age, and gender.
              </li>
              <li>
                <strong>Skin information</strong> – Skin type, concerns, and
                goals you share with us.
              </li>
              <li>
                <strong>Photos & uploads</strong> – Progress photos or other
                files you choose to provide.
              </li>
              <li>
                <strong>Activity data</strong> – Routine completion,
                interactions with the app, subscription usage.
              </li>
              <li>
                <strong>Billing information</strong> – Payment method,
                transaction history, and subscription status.
              </li>
            </ul>
          </section>

          <Separator />

          {/* Section 2 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <UserCheck className="h-5 w-5 text-skinbestie-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                2. How We Use Your Information
              </h2>
            </div>
            <p className="text-base text-gray-700 leading-relaxed mb-3">
              We use your information to:
            </p>
            <ul className="space-y-2 ml-5 list-disc text-base text-gray-700 leading-relaxed">
              <li>Provide personalized skincare coaching and routines.</li>
              <li>
                Track your skincare progress and allow your coach to give
                guidance.
              </li>
              <li>
                Recommend skincare products (including links to third-party
                retailers).
              </li>
              <li>
                Communicate with you via the app, email, or WhatsApp (with your
                consent).
              </li>
              <li>Process subscriptions, payments, and manage billing.</li>
              <li>
                Improve our services, app functionality, and user experience.
              </li>
            </ul>
          </section>

          <Separator />

          {/* Section 3 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Share2 className="h-5 w-5 text-skinbestie-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                3. Sharing of Information
              </h2>
            </div>
            <p className="text-base text-gray-700 leading-relaxed mb-3">
              We do not sell your data. We may share information only with:
            </p>
            <ul className="space-y-2 ml-5 list-disc text-base text-gray-700 leading-relaxed">
              <li>
                <strong>Coaches</strong> – Your assigned skincare coach has
                access to your profile, concerns, progress, and routines.
              </li>
              <li>
                <strong>Service providers</strong> – Third parties that help us
                process payments, store data securely, or enable WhatsApp
                messaging.
              </li>
              <li>
                <strong>Legal requirements</strong> – If required by law or
                regulation to protect Skin Bestie or our users.
              </li>
            </ul>
          </section>

          <Separator />

          {/* Section 4 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Lock className="h-5 w-5 text-skinbestie-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                4. Data Storage & Security
              </h2>
            </div>
            <ul className="space-y-2 ml-5 list-disc text-base text-gray-700 leading-relaxed">
              <li>
                Your data is stored securely using industry-standard encryption.
              </li>
              <li>
                Photos and sensitive details are protected and accessible only
                to you and your assigned coach.
              </li>
              <li>
                We take reasonable steps to protect against unauthorized access,
                alteration, or disclosure.
              </li>
            </ul>
          </section>

          <Separator />

          {/* Section 5 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-skinbestie-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                5. Your Rights
              </h2>
            </div>
            <p className="text-base text-gray-700 leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="space-y-2 ml-5 list-disc text-base text-gray-700 leading-relaxed">
              <li>Access, update, or delete your personal data.</li>
              <li>Withdraw consent for communication (unsubscribe anytime).</li>
              <li>Request a copy of your data.</li>
              <li>Deactivate your account at any time.</li>
            </ul>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700">
                To exercise these rights, contact us at:{" "}
                <a
                  href="mailto:privacy@skinbestie.com"
                  className="font-medium text-skinbestie-primary hover:underline"
                >
                  privacy@skinbestie.com
                </a>
              </p>
            </div>
          </section>

          <Separator />

          {/* Section 6 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Cookie className="h-5 w-5 text-skinbestie-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                6. Cookies & Analytics
              </h2>
            </div>
            <p className="text-base text-gray-700 leading-relaxed">
              We may use cookies and analytics tools to understand usage
              patterns and improve the app. These do not identify you
              personally.
            </p>
          </section>

          <Separator />

          {/* Section 7 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Baby className="h-5 w-5 text-skinbestie-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                7. Children&apos;s Privacy
              </h2>
            </div>
            <p className="text-base text-gray-700 leading-relaxed">
              Skin Bestie is not intended for children under 16. We do not
              knowingly collect data from minors.
            </p>
          </section>

          <Separator />

          {/* Section 8 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <RefreshCw className="h-5 w-5 text-skinbestie-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                8. Updates to this Policy
              </h2>
            </div>
            <p className="text-base text-gray-700 leading-relaxed">
              We may update this policy from time to time. Changes will be
              communicated in-app and take effect immediately upon posting.
            </p>
          </section>

          <Separator />

          {/* Section 9 - Contact */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Mail className="h-5 w-5 text-skinbestie-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                9. Contact Us
              </h2>
            </div>
            <p className="text-base text-gray-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy, please
              contact us:
            </p>
            <div className="p-4 bg-skinbestie-primary-light rounded-lg border border-skinbestie-primary/20">
              <p className="font-semibold text-gray-900 mb-1 text-sm">
                Skin Bestie
              </p>
              <a
                href="mailto:privacy@skinbestie.com"
                className="text-sm text-skinbestie-primary hover:underline font-medium"
              >
                privacy@skinbestie.com
              </a>
            </div>
          </section>
        </div>
      </Card>
    </div>
  );
}
