import { ApiKeyCard } from './api-key-card';

export function ApiKeysPage() {
  const apiKeys = [
    {
      name: 'Production API Key',
      key: 'sk_live_123456789abcdef',
      created: '2024-03-10',
      lastUsed: '2024-03-15'
    },
    {
      name: 'Development API Key',
      key: 'sk_test_987654321fedcba',
      created: '2024-03-08',
      lastUsed: '2024-03-14'
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">API Keys</h1>
      <div className="space-y-6">
        {apiKeys.map((key) => (
          <ApiKeyCard key={key.key} {...key} />
        ))}
      </div>
    </div>
  );
}