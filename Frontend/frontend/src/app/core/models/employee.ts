import { Department } from './department';
import { Position } from './position';
import { Grade } from './grade';

export interface Employee {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hireDate: string;
  department: Department;
  position: Position;
  grade: Grade;
}