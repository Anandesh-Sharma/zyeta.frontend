import { useRecoilState } from 'recoil';
import { assistantFilterState } from '@/lib/store/assistants/atoms';
import { FILTER_SECTIONS } from './constants';
import { cn } from '@/lib/utils';

export function AssistantFilter() {
  const [filter, setFilter] = useRecoilState(assistantFilterState);

  return (
    <div className="space-y-6">
      {FILTER_SECTIONS.map((section) => (
        <div key={section.title} className="space-y-2">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider px-2">{section.title}</h3>
          <div className="flex flex-col space-y-0.5">
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setFilter(prev => ({ ...prev, category: item.id as any }))}
                  className={cn(
                    'flex items-center gap-2 text-left py-2 px-2 rounded-md text-sm transition-all',
                    filter.category === item.id
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}