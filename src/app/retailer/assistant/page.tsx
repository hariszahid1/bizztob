import { AssistantView } from "./AssistantView";

export default function AssistantPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          AI Assistant
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Ask about your orders, ledger balance, and reorder suggestions.
        </p>
      </div>
      <AssistantView />
    </div>
  );
}
