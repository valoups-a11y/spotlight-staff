import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Plus, Edit, Mail, Phone, Clock, DollarSign } from "lucide-react";

// Mock data for employees
const mockEmployees = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@restaurant.com",
    phone: "(555) 123-4567",
    role: "Manager",
    hourlyRate: 25,
    contractHours: 40,
    maxHoursPerDay: 8,
    breakType: "1h continuous",
    avatar: "SJ"
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike.chen@restaurant.com",
    phone: "(555) 234-5678",
    role: "Chef",
    hourlyRate: 22,
    contractHours: 35,
    maxHoursPerDay: 7,
    breakType: "1h continuous",
    avatar: "MC"
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma.davis@restaurant.com",
    phone: "(555) 345-6789",
    role: "Waiter",
    hourlyRate: 18,
    contractHours: 30,
    maxHoursPerDay: 6,
    breakType: "Split shift",
    avatar: "ED"
  },
  {
    id: 4,
    name: "Alex Wilson",
    email: "alex.wilson@restaurant.com",
    phone: "(555) 456-7890",
    role: "Waiter",
    hourlyRate: 18,
    contractHours: 25,
    maxHoursPerDay: 6,
    breakType: "30min continuous",
    avatar: "AW"
  },
];

const Employees = () => {
  const [employees] = useState(mockEmployees);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'Manager': return 'default';
      case 'Chef': return 'secondary';
      case 'Waiter': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Employee Management</h2>
          <p className="text-muted-foreground">Manage staff profiles and work parameters</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter email address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" placeholder="e.g., Waiter, Chef, Manager" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                <Input id="hourlyRate" type="number" placeholder="Enter hourly rate" />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">Save Employee</Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-subtle shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold text-foreground">{employees.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-subtle shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Managers</p>
                <p className="text-2xl font-bold text-foreground">
                  {employees.filter(emp => emp.role === 'Manager').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-subtle shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Kitchen Staff</p>
                <p className="text-2xl font-bold text-foreground">
                  {employees.filter(emp => emp.role === 'Chef').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-subtle shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Waiters</p>
                <p className="text-2xl font-bold text-foreground">
                  {employees.filter(emp => emp.role === 'Waiter').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <Card key={employee.id} className="shadow-card hover:shadow-elegant transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-semibold">
                    {employee.avatar}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{employee.name}</CardTitle>
                    <Badge variant={getRoleBadgeVariant(employee.role)} className="mt-1">
                      {employee.role}
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{employee.phone}</span>
                </div>
              </div>

              {/* Work Parameters */}
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <h4 className="font-medium text-sm text-foreground">Work Parameters</h4>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-success" />
                    <span className="text-muted-foreground">${employee.hourlyRate}/h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-primary" />
                    <span className="text-muted-foreground">{employee.contractHours}h/week</span>
                  </div>
                </div>
                
                <div className="text-xs">
                  <div className="flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3 text-warning" />
                    <span className="text-muted-foreground">Max {employee.maxHoursPerDay}h/day</span>
                  </div>
                  <div className="text-muted-foreground">
                    Break: {employee.breakType}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Employees;