import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGetDepartmentProgressV2Query } from "@/redux/api/tnaApi";
import { TrendingUp } from "lucide-react";
import "animate.css";

type DepartmentProgressCardProps = {
  isLoading: boolean;
  data: Array<{
    department: string;
    completed: number;
    total: number;
    percentage: number;
  }>;
};

export function DepartmentProgress() {
  const { data, isLoading } = useGetDepartmentProgressV2Query({});

  return (
    <Card className="bg-gradient-card border-0 shadow-md animate__animated animate__fadeInUp">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          <span>Department Progress</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">
            Loading...
          </div>
        ) : (
          (Array.isArray(data?.data) ? data.data : []).map((dept, index) => (
            <div key={dept.department} className={`space-y-2 animate__animated animate__fadeInLeft`} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {dept.department}
                </span>
                <span className="text-sm text-muted-foreground">
                  {dept.completed}/{dept.total}
                </span>
              </div>
              <Progress value={dept.percentage} className="h-2" />
              <div className="text-right">
                <span className="text-xs text-muted-foreground">
                  {dept.percentage}% complete
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
