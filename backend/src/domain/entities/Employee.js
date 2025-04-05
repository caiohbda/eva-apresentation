const Employee = {
  create: ({ name, email, phone, department, position }) => ({
    name,
    email,
    phone,
    department,
    position
  }),

  withId: (employee, id) => ({
    ...employee,
    id
  }),

  isValid: (employee) => {
    const requiredFields = ['name', 'email', 'phone', 'department', 'position'];
    return requiredFields.every(field => employee[field] && employee[field].trim() !== '');
  }
};

module.exports = { Employee }; 