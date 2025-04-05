import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { employeeService, employeeJourneyService } from '../services/api'

export default function EmployeeDetails() {
  const { id } = useParams()
  const [employee, setEmployee] = useState(null)
  const [journey, setJourney] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeeData, journeyData] = await Promise.all([
          employeeService.getById(id),
          employeeJourneyService.getByEmployeeId(id)
        ])
        setEmployee(employeeData)
        setJourney(journeyData)
        setLoading(false)
      } catch (err) {
        setError('Erro ao carregar os dados')
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erro</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold text-gray-900">Detalhes do Colaborador</h1>
              <p className="mt-2 text-sm text-gray-700">
                Informações do colaborador e sua jornada atual.
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              {!journey && (
                <Link
                  to={`/employee/${id}/associate`}
                  className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Associar Jornada
                </Link>
              )}
            </div>
          </div>

          <div className="mt-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <div className="bg-white px-4 py-5 sm:p-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee.id}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Nome</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee.name}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">E-mail</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee.email}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Telefone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee.phone}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Departamento</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee.department}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Cargo</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee.position}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {journey && (
            <div className="mt-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <div className="bg-white px-4 py-5 sm:p-6">
                  <h2 className="text-base font-semibold leading-7 text-gray-900">Jornada Atual</h2>
                  <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">ID da Jornada</dt>
                      <dd className="mt-1 text-sm text-gray-900">{journey.journeyId}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Data de Início</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(journey.startDate).toLocaleString()}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                          journey.status === 'active' ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' :
                          journey.status === 'completed' ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20' :
                          'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20'
                        }`}>
                          {journey.status === 'active' ? 'Ativa' :
                           journey.status === 'completed' ? 'Concluída' :
                           'Pendente'}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between gap-x-6">
            <div className="flex gap-x-4">
              <Link
                to="/"
                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Voltar para Início
              </Link>
              <button
                onClick={() => navigate(-1)}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 