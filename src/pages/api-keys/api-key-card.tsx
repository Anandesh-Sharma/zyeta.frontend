import { Copy, Key } from 'lucide-react';

interface ApiKeyCardProps {
  name: string;
  key: string;
  created: string;
  lastUsed: string;
}

export function ApiKeyCard({ name, key, created, lastUsed }: ApiKeyCardProps) {
  return (
    <div className="bg-zinc-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-purple-600 flex items-center justify-center">
            <Key className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-medium text-white">{name}</h3>
        </div>
        <button className="text-zinc-400 hover:text-white transition-colors">
          <Copy className="h-5 w-5" />
        </button>
      </div>
      <div className="bg-zinc-800 rounded px-4 py-2 font-mono text-sm text-zinc-300 mb-4">
        {key}
      </div>
      <div className="flex justify-between text-sm text-zinc-400">
        <span>Created: {created}</span>
        <span>Last used: {lastUsed}</span>
      </div>
    </div>
  );
}