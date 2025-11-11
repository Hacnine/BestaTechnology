import { Users, UserCheck, Shield, UserCog, Briefcase, Ruler, Shirt, Building2 } from "lucide-react"; // Add relevant icons
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useGetUserStatsQuery } from "@/redux/api/userApi";
// Define the card configurations
const cardData = [
  {
    title: "Total Users",
    key: "total",
    icon: <Users className="h-8 w-8 text-blue-600" />,
  },
  {
    title: "Active Users",
    key: "active",
    icon: <UserCheck className="h-8 w-8 text-green-600" />,
  },
  {
    title: "Admins",
    key: "admin",
    icon: <Shield className="h-8 w-8 text-red-600" />, // Shield for Admins
  },
  {
    title: "Merchandisers",
    key: "merchandiser",
    icon: <Shirt className="h-8 w-8 text-yellow-500" />, // Shirt for Merchandisers
  },
  {
    title: "Management",
    key: "management",
    icon: <UserCog className="h-8 w-8 text-purple-600" />, // UserCog for Management
  },
  {
    title: "CAD",
    key: "cad",
    icon: <Ruler className="h-8 w-8 text-pink-500" />, // Ruler for CAD
  },
  {
    title: "Sample Fabric",
    key: "sampleFabric",
    icon: <Briefcase className="h-8 w-8 text-teal-600" />, // Briefcase for Sample Fabric
  },
  {
    title: "Sample Room",
    key: "sampleRoom",
    icon: <Building2 className="h-8 w-8 text-orange-500" />, // Building2 for Sample Room
  },
];

const RoleStats = () => {
  const { data: stats } = useGetUserStatsQuery({});
  // User stats fallback
  const roleSatistics = stats?.data || {};
  console.log(stats);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cardData.map((card) => (
        <Card key={card.key} className="bg-gradient-card border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {roleSatistics[card.key]}
                </p>
              </div>
              {card.icon}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
export default RoleStats;
