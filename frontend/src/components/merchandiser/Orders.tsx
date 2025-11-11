import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Calculator,
  Copy,
  Printer,
  Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data
const orders = [
  {
    id: "BST-2024-001",
    buyer: "H&M",
    style: "Basic Cotton Tee",
    garmentType: "Top",
    orderQty: 5000,
    smv: 15.5,
    efficiency: 85,
    pricePerUnit: 4.50,
    grossFob: 22500,
    status: "Pre-Costing",
    shipmentDate: "2024-03-15",
    createdDate: "2024-01-15"
  },
  {
    id: "BST-2024-002", 
    buyer: "Zara",
    style: "Denim Jacket",
    garmentType: "Top",
    orderQty: 2000,
    smv: 45.2,
    efficiency: 80,
    pricePerUnit: 28.75,
    grossFob: 57500,
    status: "Approved",
    shipmentDate: "2024-03-20", 
    createdDate: "2024-01-20"
  },
  {
    id: "BST-2024-003",
    buyer: "Nike", 
    style: "Athletic Shorts",
    garmentType: "Shorts",
    orderQty: 8000,
    smv: 12.8,
    efficiency: 90,
    pricePerUnit: 8.25,
    grossFob: 66000,
    status: "In-Production",
    shipmentDate: "2024-03-25",
    createdDate: "2024-01-25"
  },
  {
    id: "BST-2024-004",
    buyer: "Adidas",
    style: "Running Tee", 
    garmentType: "Top",
    orderQty: 6000,
    smv: 18.3,
    efficiency: 88,
    pricePerUnit: 6.90,
    grossFob: 41400,
    status: "Post-Costing",
    shipmentDate: "2024-03-30",
    createdDate: "2024-02-01"
  }
];

const statusColors = {
  "Pre-Costing": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Approved": "bg-green-100 text-green-800 border-green-200", 
  "In-Production": "bg-blue-100 text-blue-800 border-blue-200",
  "Post-Costing": "bg-purple-100 text-purple-800 border-purple-200"
};

export default function Orders() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [buyerFilter, setBuyerFilter] = useState("all");

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.style.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.buyer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesBuyer = buyerFilter === "all" || order.buyer === buyerFilter;
    
    return matchesSearch && matchesStatus && matchesBuyer;
  });

  const uniqueBuyers = [...new Set(orders.map(order => order.buyer))];

  const handlePreCosting = (orderId: string) => {
    navigate(`/orders/${orderId}/pre-costing`);
  };

  const handlePostCosting = (orderId: string) => {
    navigate(`/orders/${orderId}/post-costing`);
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Orders"
        description="Manage your garment manufacturing orders"
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        }
      />

      {/* Filters */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders, styles, buyers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pre-Costing">Pre-Costing</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="In-Production">In-Production</SelectItem>
                <SelectItem value="Post-Costing">Post-Costing</SelectItem>
              </SelectContent>
            </Select>

            <Select value={buyerFilter} onValueChange={setBuyerFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Buyer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Buyers</SelectItem>
                {uniqueBuyers.map(buyer => (
                  <SelectItem key={buyer} value={buyer}>{buyer}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="shadow-soft">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job No.</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Style</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Order Qty</TableHead>
                <TableHead className="text-right">SMV</TableHead>
                <TableHead className="text-right">Efficiency %</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Gross FOB</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ship Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-card-hover">
                  <TableCell className="font-medium">
                    <button 
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="text-primary hover:text-primary-light font-medium"
                    >
                      {order.id}
                    </button>
                  </TableCell>
                  <TableCell>{order.buyer}</TableCell>
                  <TableCell>{order.style}</TableCell>
                  <TableCell>{order.garmentType}</TableCell>
                  <TableCell className="text-right">{order.orderQty.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{order.smv}</TableCell>
                  <TableCell className="text-right">{order.efficiency}%</TableCell>
                  <TableCell className="text-right">${order.pricePerUnit}</TableCell>
                  <TableCell className="text-right font-semibold">${order.grossFob.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.shipmentDate}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/orders/${order.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePreCosting(order.id)}>
                          <Calculator className="mr-2 h-4 w-4" />
                          Pre-Costing
                        </DropdownMenuItem>
                        {order.status !== "Pre-Costing" && (
                          <DropdownMenuItem onClick={() => handlePostCosting(order.id)}>
                            <Calculator className="mr-2 h-4 w-4" />
                            Post-Costing
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Printer className="mr-2 h-4 w-4" />
                          Print
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}