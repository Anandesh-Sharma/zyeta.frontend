import { memo } from 'react';
import { Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useRecoilState } from 'recoil';
import { codeCopyState } from '@/lib/store/media/atoms';
import { useTheme } from '@/lib/theme-provider';
import { Button } from '@/components/ui/button';

interface CodeBlockProps {
  language: string;
  value: string;
}

export const CodeBlock = memo(({ language, value }: CodeBlockProps) => {
  const [copied, setCopied] = useRecoilState(codeCopyState(value));
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Customize the themes for better integration with our UI
  const customDarkTheme = {
    ...oneDark,
    'pre[class*="language-"]': {
      ...oneDark['pre[class*="language-"]'],
      background: 'hsl(var(--muted))',
      margin: 0,
    },
    'code[class*="language-"]': {
      ...oneDark['code[class*="language-"]'],
      background: 'none',
    }
  };

  const customLightTheme = {
    ...oneLight,
    'pre[class*="language-"]': {
      ...oneLight['pre[class*="language-"]'],
      background: 'hsl(var(--muted))',
      margin: 0,
    },
    'code[class*="language-"]': {
      ...oneLight['code[class*="language-"]'],
      background: 'none',
      color: 'hsl(var(--foreground))',
    }
  };

  // Use customized themes based on the current theme
  const syntaxTheme = isDark ? customDarkTheme : customLightTheme;

  return (
    <div className="relative group my-4">
      <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          icon={copied ? Check : Copy}
          onClick={handleCopy}
          className="bg-background/80 backdrop-blur-sm border border-border hover:bg-accent"
        />
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="px-4 py-2 border-b border-border bg-muted/50 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {language.toUpperCase()}
          </span>
        </div>
        <div className="bg-muted">
          <SyntaxHighlighter
            language={language}
            style={syntaxTheme}
            customStyle={{
              margin: 0,
              padding: '1rem',
              fontSize: '0.875rem',
              backgroundColor: 'transparent',
              border: 'none',
            }}
            showLineNumbers={true}
            wrapLines={true}
            wrapLongLines={true}
          >
            {value}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
});

CodeBlock.displayName = 'CodeBlock';