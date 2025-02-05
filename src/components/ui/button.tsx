import React, { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  asChild?: boolean;
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'default',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  isLoading,
  disabled,
  asChild = false,
  children,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : 'button';

  const content = (
    <>
      {isLoading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : Icon && (iconPosition === 'left' || !children) ? (
        <Icon className={cn("h-4 w-4", children && "mr-2")} />
      ) : null}
      {children}
      {Icon && iconPosition === 'right' && children && !isLoading && (
        <Icon className="ml-2 h-4 w-4" />
      )}
    </>
  );

  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    ghost: 'hover:bg-muted text-muted-foreground hover:text-foreground',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-9 px-4 text-sm',
    lg: 'h-10 px-5 text-base',
  };

  const buttonStyles = cn(
    'inline-flex items-center justify-center font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    !children && Icon && 'px-2',
    className
  );

  if (asChild) {
    return (
      <Comp className={buttonStyles} ref={ref} {...props}>
        {React.isValidElement(children) 
          ? React.cloneElement(children as React.ReactElement, {
              className: cn(buttonStyles, (children as React.ReactElement).props.className),
              children: content
            })
          : children}
      </Comp>
    );
  }

  return (
    <Comp className={buttonStyles} ref={ref} disabled={isLoading || disabled} {...props}>
      {content}
    </Comp>
  );
});

Button.displayName = 'Button';