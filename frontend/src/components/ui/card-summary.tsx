import { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "./card";
import { cn } from "@/lib/utils";

interface CardSummaryProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  className?: string;
  variant?: "default" | "success" | "warning" | "destructive";
}

export function CardSummary({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  className,
  variant = "default" 
}: CardSummaryProps) {
  const variantStyles = {
    default: "border-border bg-card",
    success: "border-success/20 bg-success-light/20",
    warning: "border-warning/20 bg-warning-light/20", 
    destructive: "border-destructive/20 bg-destructive-light/20"
  };

  return (
    <Card className={cn(
      "relative overflow-hidden shadow-soft hover:shadow-medium transition-shadow",
      variantStyles[variant],
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="text-sm font-medium text-muted-foreground">
          {title}
        </div>
        {icon && (
          <div className="h-4 w-4 text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {value}
        </div>
        
        <div className="flex items-center justify-between mt-2">
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
          
          {trend && (
            <div className={cn(
              "flex items-center text-xs font-medium",
              trend.isPositive 
                ? "text-success" 
                : "text-destructive"
            )}>
              <span className={cn(
                "inline-block mr-1",
                trend.isPositive ? "text-success" : "text-destructive"
              )}>
                {trend.isPositive ? "↑" : "↓"}
              </span>
              {Math.abs(trend.value)}% {trend.label}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}