import { getFullUser } from "@/lib/auth";

export default async function SettingsPage() {
  const user = await getFullUser();
  return (
    <div className="card p-6 lg:p-8 max-w-2xl">
      <h2 className="text-xl font-bold text-slate-900">Business Settings</h2>
      <p className="text-slate-500 text-sm mt-1">
        Manage your account and business details.
      </p>
      <div className="mt-6 grid gap-4">
        <div>
          <label className="label">Business name</label>
          <input
            className="input"
            defaultValue={user?.distributor?.businessName || ""}
          />
        </div>
        <div>
          <label className="label">City</label>
          <input
            className="input"
            defaultValue={user?.distributor?.city || ""}
          />
        </div>
        <div>
          <label className="label">Address</label>
          <input
            className="input"
            defaultValue={user?.distributor?.address || ""}
          />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" defaultValue={user?.phone || ""} />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button className="btn-primary">Save</button>
      </div>
      <p className="text-xs text-slate-400 mt-4">
        Settings save endpoint is coming soon.
      </p>
    </div>
  );
}
