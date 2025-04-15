const { Either } = require("fp-ts/Either");
const { pipe } = require("fp-ts/function");
const { Employee } = require("../../../domain/entities/Employee");

const EmployeeController = ({ employeeRepository }) => {
  const createEmployee = async (req, res) => {
    const employeeData = req.body;
    const employee = Employee.create(employeeData);

    try {
      const savedEmployee = await employeeRepository.save(employee);
      return res.status(201).json(savedEmployee);
    } catch (error) {
      console.error("Error creating employee:", error);
      return res.status(500).json({ error: "Erro ao criar funcionário" });
    }
  };

  const getEmployees = async (req, res) => {
    try {
      const employees = await employeeRepository.findAll();
      return res.status(200).json(employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      return res.status(500).json({ error: "Erro ao buscar funcionários" });
    }
  };

  const getEmployee = async (req, res) => {
    const { id } = req.params;

    try {
      const employee = await employeeRepository.findById(id);
      if (!employee) {
        return res.status(404).json({ error: "Funcionário não encontrado" });
      }
      return res.status(200).json(employee);
    } catch (error) {
      console.error("Error fetching employee:", error);
      return res.status(500).json({ error: "Erro ao buscar funcionário" });
    }
  };

  return {
    createEmployee,
    getEmployees,
    getEmployee,
  };
};

module.exports = EmployeeController;
