const mongoose = require('mongoose');
const { Employee } = require('../../domain/entities/Employee');

// Schema do MongoDB
const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  position: { type: String, required: true }
}, { timestamps: true });

// Modelo do MongoDB
const EmployeeModel = mongoose.model('Employee', EmployeeSchema);

const MongoEmployeeRepository = () => {
  const save = async (employee) => {
    const employeeData = {
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      position: employee.position
    };

    const savedEmployee = await EmployeeModel.create(employeeData);
    return Employee.withId(employee, savedEmployee._id.toString());
  };

  const findById = async (id) => {
    const employee = await EmployeeModel.findById(id);
    if (!employee) return null;
    
    return Employee.withId({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      position: employee.position
    }, employee._id.toString());
  };

  const findAll = async () => {
    const employees = await EmployeeModel.find();
    return employees.map(employee => 
      Employee.withId({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        department: employee.department,
        position: employee.position
      }, employee._id.toString())
    );
  };

  const update = async (id, employee) => {
    const employeeData = {
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      position: employee.position
    };

    const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
      id, 
      employeeData, 
      { new: true }
    );
    
    if (!updatedEmployee) return null;
    
    return Employee.withId(employee, updatedEmployee._id.toString());
  };

  const delete_ = async (id) => {
    const result = await EmployeeModel.findByIdAndDelete(id);
    return !!result;
  };

  return {
    save,
    findById,
    findAll,
    update,
    delete: delete_
  };
};

module.exports = MongoEmployeeRepository; 