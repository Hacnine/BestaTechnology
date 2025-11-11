import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Shirt, 
  Package, 
  Scissors, 
  Sparkles, 
  Settings, 
  Ruler,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const masterEntities = [
  {
    name: "Buyers",
    description: "Manage customer information and contacts",
    icon: Users,
    path: "/masters/buyers",
    count: 25,
    color: "bg-blue-500"
  },
  {
    name: "Styles", 
    description: "Product styles and design specifications",
    icon: Shirt,
    path: "/masters/styles",
    count: 156,
    color: "bg-green-500"
  },
  {
    name: "Products",
    description: "Garment types and categories",
    icon: Package,
    path: "/masters/products", 
    count: 12,
    color: "bg-purple-500"
  },
  {
    name: "Materials",
    description: "Yarn, fabric, and raw materials",
    icon: Scissors,
    path: "/masters/materials",
    count: 89,
    color: "bg-orange-500"
  },
  {
    name: "Trims",
    description: "Buttons, zippers, labels, and accessories",
    icon: Sparkles,
    path: "/masters/trims",
    count: 67,
    color: "bg-pink-500"
  },
  {
    name: "Processes",
    description: "Manufacturing processes and operations",
    icon: Settings,
    path: "/masters/processes",
    count: 18,
    color: "bg-indigo-500"
  },
  {
    name: "UOMs",
    description: "Units of measurement",
    icon: Ruler,
    path: "/masters/uoms",
    count: 15,
    color: "bg-teal-500"
  }
];

export default function Masters() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Masters"
        description="Manage core data entities for your ERP system"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {masterEntities.map((entity) => {
          const IconComponent = entity.icon;
          
          return (
            <Card 
              key={entity.name} 
              className="shadow-soft hover:shadow-medium transition-all duration-200 cursor-pointer group"
              onClick={() => navigate(entity.path)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${entity.color} text-white`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle add new action
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-1">
                  <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {entity.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {entity.description}
                  </p>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-foreground">
                    {entity.count}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    total records
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 bg-gradient-surface rounded-lg">
              <div className="text-2xl font-bold text-foreground">387</div>
              <div className="text-sm text-muted-foreground">Total Records</div>
            </div>
            <div className="text-center p-4 bg-gradient-surface rounded-lg">
              <div className="text-2xl font-bold text-success">12</div>
              <div className="text-sm text-muted-foreground">Added This Week</div>
            </div>
            <div className="text-center p-4 bg-gradient-surface rounded-lg">
              <div className="text-2xl font-bold text-warning">5</div>
              <div className="text-sm text-muted-foreground">Pending Approval</div>
            </div>
            <div className="text-center p-4 bg-gradient-surface rounded-lg">
              <div className="text-2xl font-bold text-primary">98.5%</div>
              <div className="text-sm text-muted-foreground">Data Quality</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}