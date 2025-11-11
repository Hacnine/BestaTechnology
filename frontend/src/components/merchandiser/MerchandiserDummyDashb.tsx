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
  Download,
  Printer,
  Calculator,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from "lucide-react";
import { VariancePill } from "@/components/ui/variance-pill";

// Mock order data
const orderData = {
  id: "BST-2024-003",
  buyer: "Nike",
  style: "Athletic Shorts",
  orderQty: 8000,
  smv: 12.8,
  efficiency: 90,
  pricePerUnit: 8.25,
  grossFob: 66000,
  status: "Post-Costing"
};

// Mock post-costing comparison data
const costingComparison = {
  estimated: {
    yarnFabric: 25200,
    conversion: 9600,
    trims: 5280,
    embellishment: 2640,
    commercial: 1320,
    commission: 1980,
    cm: 6600,
    netProfit: 13380
  },
  actual: {
    yarnFabric: 26400,
    conversion: 10200,
    trims: 5100,
    embellishment: 2500,
    commercial: 1400,
    commission: 1980,
    cm: 7200,
    netProfit: 11220
  }
};

const calculateVariance = (actual: number, estimated: number) => {
  return ((actual - estimated) / estimated) * 100;
};

export default function PostCosting() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");

  const totalVariance = calculateVariance(
    costingComparison.actual.netProfit,
    costingComparison.estimated.netProfit
  );

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title={`Post-Costing: ${orderData.id}`}
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
              <BreadcrumbPage>Post-Costing</BreadcrumbPage>
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
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        }
      />

      {/* Order Status & Variance Alert */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                {orderData.status}
              </Badge>
              <div className="text-sm text-muted-foreground">
                Completed: 3 days ago
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <div>
                  <div className="font-semibold text-foreground">Profit Variance Alert</div>
                  <div className="text-sm text-muted-foreground">
                    Actual profit is {Math.abs(totalVariance).toFixed(1)}% lower than estimated
                  </div>
                </div>
              </div>
              <VariancePill value={totalVariance} size="lg" />
            </div>
          </CardHeader>
        </Card>
      </div>

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
            {/* Variance Analysis */}
            <Card className="lg:col-span-2 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Estimated vs Actual Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Yarn & Fabric", estimated: costingComparison.estimated.yarnFabric, actual: costingComparison.actual.yarnFabric },
                    { label: "Conversion", estimated: costingComparison.estimated.conversion, actual: costingComparison.actual.conversion },
                    { label: "Trims", estimated: costingComparison.estimated.trims, actual: costingComparison.actual.trims },
                    { label: "Embellishment", estimated: costingComparison.estimated.embellishment, actual: costingComparison.actual.embellishment },
                    { label: "Commercial", estimated: costingComparison.estimated.commercial, actual: costingComparison.actual.commercial },
                    { label: "Commission", estimated: costingComparison.estimated.commission, actual: costingComparison.actual.commission },
                    { label: "CM (Cost of Making)", estimated: costingComparison.estimated.cm, actual: costingComparison.actual.cm },
                  ].map((item) => {
                    const variance = calculateVariance(item.actual, item.estimated);
                    return (
                      <div key={item.label} className="grid grid-cols-5 gap-4 p-3 rounded-lg hover:bg-card-hover">
                        <span className="font-medium text-foreground col-span-2">{item.label}</span>
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Estimated</div>
                          <div className="font-semibold text-foreground">${item.estimated.toLocaleString()}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Actual</div>
                          <div className="font-semibold text-foreground">${item.actual.toLocaleString()}</div>
                        </div>
                        <div className="text-center">
                          <VariancePill value={variance} size="sm" />
                        </div>
                      </div>
                    );
                  })}
                  
                  <Separator />
                  
                  <div className="grid grid-cols-5 gap-4 p-4 bg-gradient-surface rounded-lg border">
                    <span className="font-bold text-foreground col-span-2">Net Profit</span>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Estimated</div>
                      <div className="font-bold text-success">${costingComparison.estimated.netProfit.toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Actual</div>
                      <div className="font-bold text-destructive">${costingComparison.actual.netProfit.toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <VariancePill value={totalVariance} size="md" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <div className="space-y-4">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg">Variance Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-destructive-light rounded-lg">
                    <div>
                      <div className="font-medium text-foreground">Profit Loss</div>
                      <div className="text-sm text-muted-foreground">vs Estimated</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-destructive">
                        -${(costingComparison.estimated.netProfit - costingComparison.actual.netProfit).toLocaleString()}
                      </div>
                      <VariancePill value={totalVariance} size="sm" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Biggest Variance</span>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">CM Costs</div>
                        <VariancePill value={calculateVariance(costingComparison.actual.cm, costingComparison.estimated.cm)} size="sm" />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Best Performance</span>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">Trims</div>
                        <VariancePill value={calculateVariance(costingComparison.actual.trims, costingComparison.estimated.trims)} size="sm" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg">Reasons for Variance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium text-foreground">Higher CM Costs</div>
                        <div className="text-muted-foreground">Overtime required due to tight deadline</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium text-foreground">Fabric Price Increase</div>
                        <div className="text-muted-foreground">Cotton prices rose 5% during production</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium text-foreground">Trim Savings</div>
                        <div className="text-muted-foreground">Negotiated better prices with supplier</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fabric">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Fabric & Yarn - Estimated vs Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Dynamic comparison table will be implemented here</p>
                <p className="text-sm text-muted-foreground mt-2">Side-by-side estimated vs actual costs with variance columns</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Conversion - Estimated vs Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Conversion processes comparison table</p>
                <p className="text-sm text-muted-foreground mt-2">Process efficiency and cost variance analysis</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trims">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Trims - Estimated vs Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Trims cost comparison and variance analysis</p>
                <p className="text-sm text-muted-foreground mt-2">Individual trim items with actual vs estimated costs</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="embellishment">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Embellishment - Estimated vs Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Embellishment process variance analysis</p>
                <p className="text-sm text-muted-foreground mt-2">Printing, embroidery, and special treatment costs</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commercial">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Commercial - Estimated vs Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Commercial cost comparison</p>
                <p className="text-sm text-muted-foreground mt-2">LC charges, inspection, documentation variance</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cm">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>CM - Estimated vs Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Cost of Making variance analysis</p>
                <p className="text-sm text-muted-foreground mt-2">Labor efficiency, overhead, and factory cost comparison</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Post-Costing Notes & Learnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Post-production notes and lessons learned</p>
                <p className="text-sm text-muted-foreground mt-2">Issues encountered, solutions implemented, future improvements</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}