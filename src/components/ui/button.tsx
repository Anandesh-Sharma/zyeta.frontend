import React, { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  asChild?: boolean;
  children?: React.ReactNode;
}

const buttonVariants = {
  default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
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

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-9 px-4 text-sm',
    lg: 'h-10 px-5 text-base',
    icon: 'h-6 w-6 p-0',
  };

  const buttonStyles = cn(
    'inline-flex items-center justify-center font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    buttonVariants[variant],
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