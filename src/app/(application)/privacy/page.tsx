import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ShieldCheck,
  Database,
  Share2,
  Lock,
  UserCheck,
  Cookie,
  Baby,
  RefreshCw,
  Mail,
} from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-8 w-8 text-skinbestie-primary" />
        <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
      </div>

      {/* Effective Date */}
      <p className="text-sm text-gray-500">Effective Date: Sept 22, 2025</p>

      {/* Introduction Card */}
      <Card className="p-6 bg-gray-50 border-gray-200">
        <p className="text-gray-700 leading-relaxed">
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
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-skinbestie-primary-light">
                <Database className="h-5 w-5 text-skinbestie-primary" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                1. Information We Collect
              </h2>
            </div>
            <p className="text-gray-600">
              When you sign up and use Skin Bestie, we may collect the following
              information:
            </p>
            <ul className="space-y-3 pl-6 list-disc marker:text-gray-400">
              <li className="text-gray-700">
                <span className="font-semibold">Personal details</span> – Name,
                email, phone number, age, and gender.
              </li>
              <li className="text-gray-700">
                <span className="font-semibold">Skin information</span> – Skin
                type, concerns, and goals you share with us.
              </li>
              <li className="text-gray-700">
                <span className="font-semibold">Photos & uploads</span> –
                Progress photos or other files you choose to provide.
              </li>
              <li className="text-gray-700">
                <span className="font-semibold">Activity data</span> – Routine
                completion, interactions with the app, subscription usage.
              </li>
              <li className="text-gray-700">
                <span className="font-semibold">Billing information</span> –
                Payment method, transaction history, and subscription status.
              </li>
            </ul>
          </div>

          <Separator />

          {/* Section 2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-skinbestie-primary-light">
                <UserCheck className="h-5 w-5 text-skinbestie-primary" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                2. How We Use Your Information
              </h2>
            </div>
            <p className="text-gray-600">We use your information to:</p>
            <ul className="space-y-2 pl-6 list-disc marker:text-gray-400">
              <li className="text-gray-700">
                Provide personalized skincare coaching and routines.
              </li>
              <li className="text-gray-700">
                Track your skincare progress and allow your coach to give
                guidance.
              </li>
              <li className="text-gray-700">
                Recommend skincare products (including links to third-party
                retailers).
              </li>
              <li className="text-gray-700">
                Communicate with you via the app, email, or WhatsApp (with your
                consent).
              </li>
              <li className="text-gray-700">
                Process subscriptions, payments, and manage billing.
              </li>
              <li className="text-gray-700">
                Improve our services, app functionality, and user experience.
              </li>
            </ul>
          </div>

          <Separator />

          {/* Section 3 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-skinbestie-primary-light">
                <Share2 className="h-5 w-5 text-skinbestie-primary" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                3. Sharing of Information
              </h2>
            </div>
            <p className="text-gray-600">
              We do not sell your data. We may share information only with:
            </p>
            <ul className="space-y-3 pl-6 list-disc marker:text-gray-400">
              <li className="text-gray-700">
                <span className="font-semibold">Coaches</span> – Your assigned
                skincare coach has access to your profile, concerns, progress,
                and routines.
              </li>
              <li className="text-gray-700">
                <span className="font-semibold">Service providers</span> – Third
                parties that help us process payments, store data securely, or
                enable WhatsApp messaging.
              </li>
              <li className="text-gray-700">
                <span className="font-semibold">Legal requirements</span> – If
                required by law or regulation to protect Skin Bestie or our
                users.
              </li>
            </ul>
          </div>

          <Separator />

          {/* Section 4 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-skinbestie-primary-light">
                <Lock className="h-5 w-5 text-skinbestie-primary" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                4. Data Storage & Security
              </h2>
            </div>
            <ul className="space-y-2 pl-6 list-disc marker:text-gray-400">
              <li className="text-gray-700">
                Your data is stored securely using industry-standard encryption.
              </li>
              <li className="text-gray-700">
                Photos and sensitive details are protected and accessible only
                to you and your assigned coach.
              </li>
              <li className="text-gray-700">
                We take reasonable steps to protect against unauthorized access,
                alteration, or disclosure.
              </li>
            </ul>
          </div>

          <Separator />

          {/* Section 5 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-skinbestie-primary-light">
                <UserCheck className="h-5 w-5 text-skinbestie-primary" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                5. Your Rights
              </h2>
            </div>
            <p className="text-gray-600">You have the right to:</p>
            <ul className="space-y-2 pl-6 list-disc marker:text-gray-400">
              <li className="text-gray-700">
                Access, update, or delete your personal data.
              </li>
              <li className="text-gray-700">
                Withdraw consent for communication (unsubscribe anytime).
              </li>
              <li className="text-gray-700">Request a copy of your data.</li>
              <li className="text-gray-700">
                Deactivate your account at any time.
              </li>
            </ul>
            <Card className="p-4 bg-gray-50 border-gray-200">
              <p className="text-sm text-gray-700">
                To exercise these rights, contact us at:{" "}
                <a
                  href="mailto:privacy@skinbestie.com"
                  className="font-medium text-skinbestie-primary hover:underline"
                >
                  privacy@skinbestie.com
                </a>
              </p>
            </Card>
          </div>

          <Separator />

          {/* Section 6 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-skinbestie-primary-light">
                <Cookie className="h-5 w-5 text-skinbestie-primary" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                6. Cookies & Analytics
              </h2>
            </div>
            <p className="text-gray-700">
              We may use cookies and analytics tools to understand usage
              patterns and improve the app. These do not identify you
              personally.
            </p>
          </div>

          <Separator />

          {/* Section 7 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-skinbestie-primary-light">
                <Baby className="h-5 w-5 text-skinbestie-primary" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                7. Children&apos;s Privacy
              </h2>
            </div>
            <p className="text-gray-700">
              Skin Bestie is not intended for children under 16. We do not
              knowingly collect data from minors.
            </p>
          </div>

          <Separator />

          {/* Section 8 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-skinbestie-primary-light">
                <RefreshCw className="h-5 w-5 text-skinbestie-primary" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                8. Updates to this Policy
              </h2>
            </div>
            <p className="text-gray-700">
              We may update this policy from time to time. Changes will be
              communicated in-app and take effect immediately upon posting.
            </p>
          </div>

          <Separator />

          {/* Section 9 - Contact Card */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-skinbestie-primary-light">
                <Mail className="h-5 w-5 text-skinbestie-primary" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                9. Contact Us
              </h2>
            </div>
            <Card className="p-6 bg-skinbestie-primary-light border-skinbestie-primary/20">
              <p className="text-gray-700 mb-3">
                If you have any questions about this Privacy Policy, please
                contact us:
              </p>
              <div className="space-y-1">
                <p className="font-semibold text-gray-900">Skin Bestie</p>
                <a
                  href="mailto:privacy@skinbestie.com"
                  className="flex items-center gap-2 text-skinbestie-primary hover:underline font-medium"
                >
                  <Mail className="h-4 w-4" />
                  privacy@skinbestie.com
                </a>
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}
