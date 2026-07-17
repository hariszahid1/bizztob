import { MessageSquare } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="card p-10 text-center">
      <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 grid place-items-center mx-auto">
        <MessageSquare className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-xl font-bold text-slate-900">Messages</h2>
      <p className="text-slate-500 mt-1 max-w-md mx-auto">
        Chat with your distributors is coming soon. Contact them by phone in the
        meantime.
      </p>
    </div>
  );
}
