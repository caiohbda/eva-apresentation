import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  employeeService,
  journeyService,
  employeeJourneyService,
} from "../services/api";

export default function AssociateJourney() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [availableJourneys, setAvailableJourneys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [formData, setFormData] = useState({
    journeyId: "",
    startDate: "",
    actionSchedules: [],
  });
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [employeesData, journeysData] = await Promise.all([
        employeeService.list(),
        journeyService.list(),
      ]);

      // Filtrar colaboradores por termo de busca
      let filteredEmployees = employeesData;
      if (searchTerm) {
        filteredEmployees = employeesData.filter(
          (employee) =>
            employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.department.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Calcular paginação
      const totalItems = filteredEmployees.length;
      const totalPagesCount = Math.ceil(totalItems / itemsPerPage);
      setTotalPages(totalPagesCount);

      // Aplicar paginação
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

      setEmployees(paginatedEmployees);
      setAvailableJourneys(journeysData);
      setLoading(false);
    } catch (err) {
      setError("Erro ao carregar os dados");
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Resetar para a primeira página ao buscar
    fetchData();
  };

  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setFormData((prev) => ({
      ...prev,
      employeeId: employee.id,
    }));
  };

  const handleJourneyChange = (e) => {
    const journeyId = e.target.value;
    const journey = availableJourneys.find((j) => j.id === journeyId);
    setSelectedJourney(journey);

    // Inicializa os horários das ações como vazios
    const actionSchedules = journey
      ? journey.actions.map((action) => ({
          actionId: action.id,
          scheduledTime: "",
        }))
      : [];

    setFormData((prev) => ({
      ...prev,
      journeyId,
      actionSchedules,
    }));
  };

  const handleScheduleChange = (actionId, time) => {
    setFormData((prev) => ({
      ...prev,
      actionSchedules: prev.actionSchedules.map((schedule) =>
        schedule.actionId === actionId
          ? { ...schedule, scheduledTime: time }
          : schedule
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) {
      setError("Selecione um colaborador primeiro");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Formata a data para o formato ISO
      const formattedDate = new Date(formData.startDate).toISOString();

      await employeeJourneyService.create({
        employeeId: selectedEmployee.id,
        ...formData,
        startDate: formattedDate,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao associar a jornada");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="rounded-md bg-red-50 p-4 max-w-md">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erro</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      <div className="flex-1 py-12">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold text-gray-900">
                Associar Jornada
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                Selecione um colaborador e associe uma jornada a ele.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-4">
              <form onSubmit={handleSearch} className="flex gap-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Buscar colaborador por nome, email ou departamento"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Buscar
                </button>
              </form>
            </div>

            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Nome
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Departamento
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Cargo
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Selecionar</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {employees.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-3 py-4 text-sm text-gray-500 text-center"
                      >
                        Nenhum colaborador encontrado
                      </td>
                    </tr>
                  ) : (
                    employees.map((employee) => (
                      <tr key={employee.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {employee.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {employee.email}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {employee.department}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {employee.position}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <input
                            type="radio"
                            name="selectedEmployee"
                            checked={selectedEmployee?.id === employee.id}
                            onChange={() => handleSelectEmployee(employee)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-600 border-gray-300"
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}

            {selectedEmployee && (
              <div className="mt-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <form
                    onSubmit={handleSubmit}
                    className="bg-white px-4 py-5 sm:p-6"
                  >
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="journeyId"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Jornada
                        </label>
                        <div className="mt-2">
                          <select
                            id="journeyId"
                            name="journeyId"
                            value={formData.journeyId}
                            onChange={handleJourneyChange}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            required
                          >
                            <option value="">Selecione uma jornada</option>
                            {availableJourneys.map((journey) => (
                              <option key={journey.id} value={journey.id}>
                                {journey.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="startDate"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Data de Início
                        </label>
                        <div className="mt-2">
                          <input
                            type="date"
                            name="startDate"
                            id="startDate"
                            value={formData.startDate}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                startDate: e.target.value,
                              }))
                            }
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {selectedJourney &&
                      selectedJourney.actions &&
                      selectedJourney.actions.length > 0 && (
                        <div className="mt-8">
                          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                            Horários das Ações
                          </h3>
                          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {selectedJourney.actions.map((action, index) => (
                              <div
                                key={action.id}
                                className="bg-gray-50 p-4 rounded-lg"
                              >
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  {action.description || `Ação ${index + 1}`}
                                </label>
                                <div className="mt-1">
                                  <input
                                    type="time"
                                    value={
                                      formData.actionSchedules.find(
                                        (s) => s.actionId === action.id
                                      )?.scheduledTime || ""
                                    }
                                    onChange={(e) =>
                                      handleScheduleChange(
                                        action.id,
                                        e.target.value
                                      )
                                    }
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                  />
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                  Tipo: {action.type}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {error && (
                      <div className="mt-4 rounded-md bg-red-50 p-4">
                        <div className="flex">
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                              Erro
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                              <p>{error}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {success && (
                      <div className="mt-4 rounded-md bg-green-50 p-4">
                        <div className="flex">
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-green-800">
                              Sucesso
                            </h3>
                            <div className="mt-2 text-sm text-green-700">
                              <p>
                                Jornada associada com sucesso! Redirecionando...
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-6 flex items-center justify-between gap-x-6">
                      <div className="flex gap-x-4">
                        <button
                          type="button"
                          onClick={() => navigate("/")}
                          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          Voltar para Início
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(-1)}
                          className="text-sm font-semibold leading-6 text-gray-900"
                        >
                          Voltar
                        </button>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                      >
                        {loading ? "Salvando..." : "Salvar"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
