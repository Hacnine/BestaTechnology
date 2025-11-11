import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Save,
  Send,
  Check,
  X,
  Download,
  Printer,
  Calculator,
  ArrowLeft,
  TrendingUp
} from "lucide-react";
import { VariancePill } from "@/components/ui/variance-pill";

// Mock order data
const orderData = {
  id: "BST-2024-001",
  buyer: "H&M",
  style: "Basic Cotton Tee",
  orderQty: 5000,
  smv: 15.5,
  efficiency: 85,
  pricePerUnit: 4.50,
  grossFob: 22500,
  status: "Pre-Costing"
};

// Mock costing summary
const costingSummary = {
  grossFob: 22500,
  yarnFabric: 8750,
  conversion: 3200,
  trims: 1800,
  embellishment: 950,
  commercial: 450,
  commission: 675,
  cm: 2100,
  netFob: 21825,
  costOfMaterials: 14700,
  contribution: 7125,
  grossProfit: 5025,
  operatingProfit: 4575,
  netProfit: 4125
};

export default function PreCosting() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");

  const profitPercentage = ((costingSummary.netProfit / costingSummary.grossFob) * 100).toFixed(1);
  const contributionPercentage = ((costingSummary.contribution / costingSummary.grossFob) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title={`Pre-Costing: ${orderData.id}`}
        description={`${orderData.buyer} • ${orderData.style} • ${orderData.orderQty.toLocaleString()} pcs`}
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate("/orders")} className="cursor-pointer">
                  Orders
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate(`/orders/${id}`)} className="cursor-pointer">
                  {orderData.id}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbPage>Pre-Costing</BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/orders")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button size="sm">
              <Send className="h-4 w-4 mr-2" />
              Submit for Approval
            </Button>
          </div>
        }
      />

      {/* Order Status */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                {orderData.status}
              </Badge>
              <div className="text-sm text-muted-foreground">
                Last updated: 2 hours ago
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">${orderData.pricePerUnit}</div>
                <div className="text-sm text-muted-foreground">Unit Price</div>
              </div>
              <Separator orientation="vertical" className="h-12" />
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">${orderData.grossFob.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Gross FOB</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="fabric">Fabric & Yarn</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="trims">Trims</TabsTrigger>
          <TabsTrigger value="embellishment">Embellishment</TabsTrigger>
          <TabsTrigger value="commercial">Commercial</TabsTrigger>
          <TabsTrigger value="cm">CM</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Cost Breakdown */}
            <Card className="lg:col-span-2 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Yarn & Fabric", amount: costingSummary.yarnFabric, percentage: (costingSummary.yarnFabric / costingSummary.grossFob * 100) },
                    { label: "Conversion", amount: costingSummary.conversion, percentage: (costingSummary.conversion / costingSummary.grossFob * 100) },
                    { label: "Trims", amount: costingSummary.trims, percentage: (costingSummary.trims / costingSummary.grossFob * 100) },
                    { label: "Embellishment", amount: costingSummary.embellishment, percentage: (costingSummary.embellishment / costingSummary.grossFob * 100) },
                    { label: "Commercial", amount: costingSummary.commercial, percentage: (costingSummary.commercial / costingSummary.grossFob * 100) },
                    { label: "Commission", amount: costingSummary.commission, percentage: (costingSummary.commission / costingSummary.grossFob * 100) },
                    { label: "CM (Cost of Making)", amount: costingSummary.cm, percentage: (costingSummary.cm / costingSummary.grossFob * 100) },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 rounded-lg hover:bg-card-hover">
                      <span className="font-medium text-foreground">{item.label}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{item.percentage.toFixed(1)}%</span>
                        <span className="font-semibold text-foreground w-20 text-right">
                          ${item.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="bg-gradient-success/10 p-4 rounded-lg">
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span className="text-foreground">Net Profit</span>
                      <div className="flex items-center gap-3">
                        <VariancePill value={parseFloat(profitPercentage)} showIcon={false} />
                        <span className="text-success">${costingSummary.netProfit.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="space-y-4">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg">Profitability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Net Profit %</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <span className="font-semibold text-success">{profitPercentage}%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Contribution %</span>
                    <span className="font-semibold text-foreground">{contributionPercentage}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Gross Profit</span>
                    <span className="font-semibold text-foreground">${costingSummary.grossProfit.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg">Order Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SMV</span>
                    <span className="font-medium">{orderData.smv}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Efficiency</span>
                    <span className="font-medium">{orderData.efficiency}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Qty</span>
                    <span className="font-medium">{orderData.orderQty.toLocaleString()} pcs</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fabric">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Fabric & Yarn Costing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Dynamic table component will be implemented here</p>
                <p className="text-sm text-muted-foreground mt-2">Schema-driven table with inline editing, formulas, and validation</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Conversion Costing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Conversion processes table will be implemented here</p>
                <p className="text-sm text-muted-foreground mt-2">Knitting, Dyeing, Finishing processes with costs</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trims">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Trims Costing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Trims and accessories costing table</p>
                <p className="text-sm text-muted-foreground mt-2">Buttons, zippers, labels, packaging materials</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="embellishment">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Embellishment Costing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Embellishment processes and costs</p>
                <p className="text-sm text-muted-foreground mt-2">Printing, embroidery, special treatments</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commercial">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Commercial & Commission</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Commercial costs and commission structure</p>
                <p className="text-sm text-muted-foreground mt-2">LC charges, inspection, documentation, agent commission</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cm">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>CM (Cost of Making)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Cost of Making calculation</p>
                <p className="text-sm text-muted-foreground mt-2">Labor, overhead, factory costs based on SMV and efficiency</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Notes & Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Notes and special instructions</p>
                <p className="text-sm text-muted-foreground mt-2">Additional information, assumptions, special requirements</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}