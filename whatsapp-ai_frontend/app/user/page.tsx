"use client";

import Link from "next/link";

export default function UserDashboard() {
  return (
    <main className="p-10 bg-gray-100 h-screen">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      <section className="mb-6">
        <h2 className="text-xl mb-2">Profile</h2>
        <p className="text-gray-700">
          Manage your profile and WhatsApp settings.
        </p>
      </section>
      <section className="mb-6">
        <Link href="/user/whatsapp">Go to WhatsApp Connection Management</Link>
      </section>
    </main>
  );
}
