import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface VariancePillProps {
  value: number;
  showIcon?: boolean;
  showSign?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function VariancePill({ 
  value, 
  showIcon = true, 
  showSign = true, 
  className,
  size = "md" 
}: VariancePillProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  
  const sizeStyles = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-2.5 py-1.5", 
    lg: "text-base px-3 py-2"
  };

  const iconSize = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }[size];

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 rounded-full font-medium",
      sizeStyles[size],
      isNeutral && "bg-muted text-muted-foreground",
      isPositive && "bg-success-light text-success",
      !isPositive && !isNeutral && "bg-destructive-light text-destructive",
      className
    )}>
      {showIcon && (
        <>
          {isNeutral && <Minus className={iconSize} />}
          {isPositive && <TrendingUp className={iconSize} />}
          {!isPositive && !isNeutral && <TrendingDown className={iconSize} />}
        </>
      )}
      
      <span>
        {showSign && !isNeutral && (isPositive ? "+" : "")}
        {value.toFixed(1)}%
      </span>
    </div>
  );
}