import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "react-router-dom";
import { Store, Users, Calendar, BarChart3, Clock, ChefHat, Plus } from "lucide-react";

// Mock data for admin dashboard
const mockRestaurants = [
  { id: 1, name: "Main Street Bistro", address: "123 Main St", status: "Active", employees: 12 },
  { id: 2, name: "Downtown Kitchen", address: "456 Oak Ave", status: "Active", employees: 8 },
];

const quickStats = [
  { label: "Total Employees", value: 20, icon: Users, color: "text-primary" },
  { label: "Active Shifts", value: 15, icon: Clock, color: "text-success" },
  { label: "Restaurants", value: 2, icon: Store, color: "text-warning" },
  { label: "This Week Hours", value: 320, icon: BarChart3, color: "text-primary" },
];

const Index = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-primary rounded-xl p-8 text-white shadow-elegant">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Restaurant Management System</h1>
            <p className="text-white/90">Streamline your restaurant operations with smart scheduling</p>
          </div>
        </div>
        
        <div className="flex gap-4 mt-6">
          <Button asChild variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
            <NavLink to="/scheduling">
              <Calendar className="w-4 h-4 mr-2" />
              View Schedule
            </NavLink>
          </Button>
          <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
            <NavLink to="/employees">
              <Users className="w-4 h-4 mr-2" />
              Manage Staff
            </NavLink>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Restaurant Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              Restaurant Locations
            </CardTitle>
            <Button className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Restaurant
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-semibold">
                    {restaurant.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{restaurant.name}</h3>
                    <p className="text-sm text-muted-foreground">{restaurant.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-success border-success">
                    {restaurant.status}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {restaurant.employees} employees
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card hover:shadow-elegant transition-all duration-200 cursor-pointer group">
          <NavLink to="/scheduling" className="block">
            <CardContent className="p-6 text-center">
              <Calendar className="w-12 h-12 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-foreground mb-2">Schedule Management</h3>
              <p className="text-sm text-muted-foreground">Create and manage employee schedules with drag-and-drop</p>
            </CardContent>
          </NavLink>
        </Card>

        <Card className="shadow-card hover:shadow-elegant transition-all duration-200 cursor-pointer group">
          <NavLink to="/employees" className="block">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-foreground mb-2">Employee Management</h3>
              <p className="text-sm text-muted-foreground">Add and edit employee profiles and work parameters</p>
            </CardContent>
          </NavLink>
        </Card>

        <Card className="shadow-card hover:shadow-elegant transition-all duration-200 cursor-pointer group">
          <NavLink to="/reports" className="block">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-12 h-12 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-foreground mb-2">Reports & Analytics</h3>
              <p className="text-sm text-muted-foreground">View hours tracking and export payroll reports</p>
            </CardContent>
          </NavLink>
        </Card>
      </div>

      {/* Supabase Integration Notice */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <Store className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Ready for Backend Integration</h3>
              <p className="text-muted-foreground mb-4">
                Connect to Supabase to enable full functionality including data persistence, 
                restaurant management, employee profiles, and schedule storage.
              </p>
              <Button variant="outline" size="sm">
                Connect Supabase
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
