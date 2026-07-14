"use client";

import Image from "next/image";
import { useState } from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { APP_NAME } from "@/constants";

type TabId = "personal" | "security" | "notifications" | "company";

const SETTING_TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "personal", label: "Personal Information", icon: "person" },
  { id: "security", label: "Account Security", icon: "security" },
  { id: "notifications", label: "Notifications", icon: "notifications_active" },
  { id: "company", label: "Company Settings", icon: "business" },
];

const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDLtJFiHZHbRR2Pfhywe-CQ5TvWD-H2y5stwfIZ5j6sYbJeV_b-wnB73PQ7u0Ua4E2E67HwZrIjmiTrvJSMjWFxUXZl31APgXO0AATPNsInEOCwKhPddfyRx2pFbPqdkIOAHpBc9UVu2pixEmNKInmmuvefqFYrXI6vNlPLf10Zeg0QWU-7TUZSR3wDxZ3OCTERPsYfhQ5o8-mvN9_wna1RhQHt-Me0hOCN2jQ4rZfkvXo3Kyc8Oo8bzdJYTXEepmxkH5swjMCjawk";

const COMPANY_LOGO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDz0VAnXdsUUZxA9beMHTj3OGLi0bX_u8Xgp0wyfwN0T4Z4rIGV6gXKNSJDSc3fEEkg92Nx_BHSvsx2OfDCEgiUez49YNC9DW6kO9aXyT_Mq3GE092O3SBuKdMDzF75-TaUFrSKKdvSnxfIC-0E5SeE0EX5dUBbwAS9DL_ao_GATpMSrUXTv6Tu8_Tub_Uiol2LuckQYRuowVBShvxkucr-NdlV8Gu1Mqa6ZmFsKxxkWXpiDzVryMWPx2Jd6N_LQN0OE4d-Pn_rdMU";

const INPUT_CLASS =
  "w-full px-4 py-3 rounded-[10px] border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";

export default function AdminProfilePage() {
  const [activeTab, setActiveTab] = useState<TabId>("personal");

  const [profile, setProfile] = useState({
    firstName: "Sarah",
    lastName: "Jenkins",
    email: "sarah.jenkins@payrollpro.io",
    phone: "+1 (555) 0123-4567",
    timezone: "Eastern Standard Time (EST)",
  });

  const [notifications, setNotifications] = useState({
    payroll: true,
    compliance: true,
    security: true,
  });

  return (
    <>
      <DashboardHeader
        title="Payroll Management"
        subtitle="Account Settings"
        showSearch={false}
      />
      <main className="p-gutter max-w-7xl mx-auto">
        <div className="mb-stack-xl">
          <h1 className="font-display-md text-display-md text-on-surface">Settings</h1>
          <p className="text-on-surface-variant font-body-lg">
            Manage your personal profile, security preferences, and organizational details.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Settings Sidebar Nav */}
          <div className="col-span-12 md:col-span-3 sticky top-24">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm p-2 space-y-1">
              {SETTING_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-label-md text-label-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? "text-primary bg-primary/5 font-bold"
                      : "text-on-surface-variant hover:bg-surface-container-low"
                  }`}
                >
                  <MaterialIcon icon={tab.icon} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Settings Content */}
          <div className="col-span-12 md:col-span-9 space-y-8">
            {/* Personal Information */}
            {activeTab === "personal" && (
              <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50">
                  <div>
                    <h3 className="font-headline-sm text-on-surface">Personal Information</h3>
                    <p className="text-on-surface-variant text-body-md">
                      Update your photo and personal details here.
                    </p>
                  </div>
                  <button className="bg-primary text-on-primary px-6 py-2.5 rounded-[10px] font-label-md shadow-sm hover:brightness-110 active:scale-95 transition-all">
                    Save Changes
                  </button>
                </div>
                <div className="p-8 space-y-8">
                  {/* Avatar */}
                  <div className="flex items-center gap-8">
                    <div className="relative group">
                      <Image
                        className="w-24 h-24 rounded-full object-cover border-2 border-primary-container"
                        src={AVATAR}
                        alt="Profile picture"
                        width={96}
                        height={96}
                      />
                      <button className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-lg border-2 border-white hover:scale-110 transition-transform">
                        <MaterialIcon icon="edit" className="text-[18px]" />
                      </button>
                    </div>
                    <div>
                      <h4 className="font-label-md text-on-surface mb-1">Your Profile Picture</h4>
                      <p className="text-on-surface-variant text-label-sm mb-4">PNG, JPG or GIF. Max size 2MB.</p>
                      <div className="flex gap-3">
                        <button className="px-4 py-2 border border-outline-variant rounded-[10px] text-on-surface-variant font-label-sm hover:bg-surface-container-low transition-colors">
                          Upload New
                        </button>
                        <button className="px-4 py-2 text-error font-label-sm hover:bg-error/5 rounded-[10px] transition-colors">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-2">
                      <label className="font-label-md text-on-surface" htmlFor="firstName">First Name</label>
                      <input
                        className={INPUT_CLASS}
                        id="firstName"
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-md text-on-surface" htmlFor="lastName">Last Name</label>
                      <input
                        className={INPUT_CLASS}
                        id="lastName"
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="font-label-md text-on-surface" htmlFor="email">Email Address</label>
                      <div className="relative">
                        <MaterialIcon icon="mail" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]" />
                        <input
                          className="w-full pl-12 pr-4 py-3 rounded-[10px] border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-md text-on-surface" htmlFor="phone">Phone Number</label>
                      <input
                        className={INPUT_CLASS}
                        id="phone"
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-md text-on-surface" htmlFor="timezone">Timezone</label>
                      <select
                        className={INPUT_CLASS}
                        id="timezone"
                        value={profile.timezone}
                        onChange={(e) => setProfile((p) => ({ ...p, timezone: e.target.value }))}
                      >
                        <option>Pacific Standard Time (PST)</option>
                        <option>Eastern Standard Time (EST)</option>
                        <option>Greenwich Mean Time (GMT)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Security */}
            {activeTab === "security" && (
              <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-outline-variant bg-surface-container-low/50">
                  <h3 className="font-headline-sm text-on-surface">Account Security</h3>
                  <p className="text-on-surface-variant text-body-md">
                    Manage your password and authentication methods.
                  </p>
                </div>
                <div className="p-8 space-y-10">
                  {/* Password */}
                  <div className="flex items-start gap-12">
                    <div className="w-1/3">
                      <h4 className="font-label-md text-on-surface">Change Password</h4>
                      <p className="text-on-surface-variant text-label-sm">
                        Update your password regularly to keep your account secure.
                      </p>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <label className="font-label-md text-on-surface" htmlFor="currentPwd">Current Password</label>
                        <input className={INPUT_CLASS} id="currentPwd" placeholder="••••••••••••" type="password" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="font-label-md text-on-surface" htmlFor="newPwd">New Password</label>
                          <input className={INPUT_CLASS} id="newPwd" type="password" />
                        </div>
                        <div className="space-y-2">
                          <label className="font-label-md text-on-surface" htmlFor="confirmPwd">Confirm New Password</label>
                          <input className={INPUT_CLASS} id="confirmPwd" type="password" />
                        </div>
                      </div>
                      <button className="bg-secondary-fixed text-on-secondary-fixed px-6 py-2 rounded-[10px] font-label-md hover:bg-secondary-container transition-colors">
                        Update Password
                      </button>
                    </div>
                  </div>

                  <hr className="border-outline-variant" />

                  {/* 2FA */}
                  <div className="flex items-center justify-between p-6 bg-surface-container-low rounded-xl border border-outline-variant">
                    <div className="flex gap-4 items-start">
                      <div className="p-3 bg-primary/10 text-primary rounded-lg">
                        <MaterialIcon icon="lock" filled />
                      </div>
                      <div>
                        <h4 className="font-label-md text-on-surface">Two-Factor Authentication (2FA)</h4>
                        <p className="text-on-surface-variant text-label-sm">
                          Add an extra layer of security to your account.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-label-sm flex items-center gap-1">
                        <MaterialIcon icon="check_circle" className="text-[14px]" filled />
                        Enabled
                      </span>
                      <button className="px-4 py-2 border border-outline-variant rounded-[10px] text-on-surface font-label-sm hover:bg-surface-container-high transition-colors">
                        Disable
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-outline-variant bg-surface-container-low/50">
                  <h3 className="font-headline-sm text-on-surface">Notification Preferences</h3>
                  <p className="text-on-surface-variant text-body-md">
                    Choose how and when you want to be notified.
                  </p>
                </div>
                <div className="p-8 space-y-6">
                  <h4 className="font-label-md text-on-surface uppercase tracking-wider text-[11px] text-on-surface-variant/70">
                    General Notifications
                  </h4>
                  <div className="space-y-2">
                    {[
                      { key: "payroll" as const, label: "Payroll Processing Alerts", description: "Get notified when a payroll batch starts or finishes." },
                      { key: "compliance" as const, label: "Compliance Reminders", description: "Reminders for tax filings and regulatory deadlines." },
                      { key: "security" as const, label: "Security Alerts", description: "Critical updates about account access and unusual logins." },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center justify-between p-4 hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer"
                      >
                        <div className="flex flex-col">
                          <span className="font-label-md text-on-surface">{item.label}</span>
                          <span className="text-on-surface-variant text-label-sm">{item.description}</span>
                        </div>
                        <input
                          className="w-12 h-6 rounded-full border-none bg-primary-container text-primary cursor-pointer focus:ring-0"
                          type="checkbox"
                          checked={notifications[item.key]}
                          onChange={(e) => setNotifications((n) => ({ ...n, [item.key]: e.target.checked }))}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Company Settings */}
            {activeTab === "company" && (
              <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-outline-variant bg-surface-container-low/50">
                  <h3 className="font-headline-sm text-on-surface">Company Settings</h3>
                  <p className="text-on-surface-variant text-body-md">
                    Manage organization identity and legal details.
                  </p>
                </div>
                <div className="p-8 space-y-8">
                  <div className="flex items-start gap-8">
                    <div className="w-20 h-20 rounded-xl bg-surface-container-high border border-outline-variant flex items-center justify-center overflow-hidden">
                      <Image src={COMPANY_LOGO} alt="Company logo" width={80} height={80} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-label-md text-on-surface">Organization Logo</h4>
                      <p className="text-on-surface-variant text-label-sm mb-4">This will appear on invoices and reports.</p>
                      <button className="px-4 py-2 bg-surface-variant text-on-surface-variant rounded-[10px] font-label-sm hover:bg-outline-variant transition-colors">
                        Change Logo
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="font-label-md text-on-surface" htmlFor="legalName">Legal Entity Name</label>
                      <input className={INPUT_CLASS} id="legalName" type="text" defaultValue="PayRoll Pro Enterprise Solutions LLC" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="font-label-md text-on-surface" htmlFor="taxId">Tax ID (EIN)</label>
                        <input className={INPUT_CLASS} id="taxId" type="text" defaultValue="XX-XXXXXXX" />
                      </div>
                      <div className="space-y-2">
                        <label className="font-label-md text-on-surface" htmlFor="website">Company Website</label>
                        <input className={INPUT_CLASS} id="website" type="url" defaultValue="https://payrollpro.io" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-md text-on-surface" htmlFor="address">Registered Business Address</label>
                      <textarea
                        className={`${INPUT_CLASS} resize-none`}
                        id="address"
                        rows={3}
                        defaultValue={`123 Financial District Plaza, Suite 500\nNew York, NY 10005\nUnited States`}
                      />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Footer inside settings */}
            <footer className="w-full py-stack-md flex justify-between items-center px-4 mt-8 border-t border-outline-variant">
              <span className="font-label-sm text-secondary">© 2024 {APP_NAME}. All rights reserved.</span>
              <div className="flex items-center gap-6">
                {["Privacy Policy", "Terms of Service", "Help Center"].map((link) => (
                  <a key={link} href="#" className="font-label-sm text-on-surface-variant hover:text-primary transition-opacity">
                    {link}
                  </a>
                ))}
              </div>
            </footer>
          </div>
        </div>
      </main>
    </>
  );
}
