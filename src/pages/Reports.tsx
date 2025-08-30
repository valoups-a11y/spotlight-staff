import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Download, TrendingUp, Clock, DollarSign } from "lucide-react";

// Mock data for reports
const mockReports = [
  {
    employeeName: "Sarah Johnson",
    role: "Manager",
    normalHours: 32,
    overtimeHours: 8,
    totalHours: 40,
    hourlyRate: 25,
    totalPay: 1200
  },
  {
    employeeName: "Mike Chen",
    role: "Chef",
    normalHours: 35,
    overtimeHours: 5,
    totalHours: 40,
    hourlyRate: 22,
    totalPay: 935
  },
  {
    employeeName: "Emma Davis",
    role: "Waiter",
    normalHours: 28,
    overtimeHours: 2,
    totalHours: 30,
    hourlyRate: 18,
    totalPay: 567
  },
  {
    employeeName: "Alex Wilson",
    role: "Waiter",
    normalHours: 25,
    overtimeHours: 0,
    totalHours: 25,
    hourlyRate: 18,
    totalPay: 450
  },
];

const Reports = () => {
  const totalNormalHours = mockReports.reduce((sum, emp) => sum + emp.normalHours, 0);
  const totalOvertimeHours = mockReports.reduce((sum, emp) => sum + emp.overtimeHours, 0);
  const totalPayroll = mockReports.reduce((sum, emp) => sum + emp.totalPay, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reports & Analytics</h2>
          <p className="text-muted-foreground">Weekly overview for Jan 15 - Jan 21, 2024</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-subtle shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold text-foreground">{totalNormalHours + totalOvertimeHours}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-subtle shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Normal Hours</p>
                <p className="text-2xl font-bold text-foreground">{totalNormalHours}</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-subtle shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overtime Hours</p>
                <p className="text-2xl font-bold text-foreground">{totalOvertimeHours}</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-subtle shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Payroll</p>
                <p className="text-2xl font-bold text-foreground">${totalPayroll.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Employee Hours Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground">Employee</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
                  <th className="text-center p-4 font-medium text-muted-foreground">Normal Hours</th>
                  <th className="text-center p-4 font-medium text-muted-foreground">Overtime</th>
                  <th className="text-center p-4 font-medium text-muted-foreground">Total Hours</th>
                  <th className="text-center p-4 font-medium text-muted-foreground">Hourly Rate</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Total Pay</th>
                </tr>
              </thead>
              <tbody>
                {mockReports.map((employee, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {employee.employeeName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium">{employee.employeeName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary">{employee.role}</Badge>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-medium text-success">{employee.normalHours}h</span>
                    </td>
                    <td className="p-4 text-center">
                      {employee.overtimeHours > 0 ? (
                        <span className="font-medium text-warning">{employee.overtimeHours}h</span>
                      ) : (
                        <span className="text-muted-foreground">0h</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-semibold">{employee.totalHours}h</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-medium">${employee.hourlyRate}/h</span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-semibold text-primary">${employee.totalPay.toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hours Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Chart visualization</p>
                <p className="text-sm text-muted-foreground">Connect to Supabase for dynamic charts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Trend analysis</p>
                <p className="text-sm text-muted-foreground">Connect to Supabase for dynamic trends</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;