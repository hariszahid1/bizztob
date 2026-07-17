import { MessageSquare, User } from "lucide-react";

export default function TeamPage() {
  const members = [
    { name: "Naeem", role: "Admin", orders: null },
    { name: "Ali Ahmad", role: "Sales person", orders: 12 },
    { name: "Ali", role: "Manager", orders: null },
    { name: "Ali Ahmad", role: "Sales person", orders: 10 },
  ];
  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <button className="btn-primary">Manage Roles</button>
        <button className="btn-primary">Add Member</button>
      </div>

      <div className="card">
        <div className="p-5 flex items-center justify-between">
          <div className="search-box max-w-md flex-1">
            <input placeholder="Search" />
          </div>
          <button className="filter-pill">Filter</button>
        </div>
        <div className="divide-y divide-slate-100">
          {members.map((m, i) => (
            <div key={i} className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-brand-100 grid place-items-center text-brand-600 font-bold text-lg">
                {m.name.charAt(0)}
              </div>
              <div className="w-32">
                <p className="font-semibold text-slate-900">{m.name}</p>
              </div>
              <div className="flex-1 text-sm text-slate-500">{m.role}</div>
              {m.orders !== null && (
                <div className="hidden md:block text-sm">
                  <span className="text-slate-500">Assigned Orders</span>
                  <span className="ml-2 font-semibold text-slate-800">
                    {m.orders}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <button className="h-9 w-9 rounded-md bg-brand-gradient text-white grid place-items-center">
                  <User className="h-4 w-4" />
                </button>
                <button className="h-9 w-9 rounded-md bg-brand-gradient text-white grid place-items-center">
                  <MessageSquare className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-2">
        Team members are placeholder data. Real member management coming soon.
      </p>
    </div>
  );
}
