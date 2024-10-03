export default function AdminDashboard() {
  return (
    <main className="p-10 bg-gray-100 h-screen">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <section className="mb-6">
        <h2 className="text-xl mb-2">Manage Users</h2>
        <p className="text-gray-700">
          View and update user settings, monitor sessions, and more.
        </p>
      </section>
      <section>
        <h2 className="text-xl mb-2">Bot Configurations</h2>
        <p className="text-gray-700 mb-4">
          Create and update default bot settings.
        </p>
      </section>
    </main>
  );
}
