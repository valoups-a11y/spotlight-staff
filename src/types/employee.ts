export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  hourlyRate: number;
  contractHours: number;
  maxHoursPerDay: number;
  breakType: string;
  avatar: string;
}

export interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  hourlyRate: number;
  contractHours: number;
  maxHoursPerDay: number;
  breakType: string;
}