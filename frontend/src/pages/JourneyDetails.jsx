import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { employeeJourneyService } from '../services/api'

export default function JourneyDetails() {
  const { id } = useParams()
  const [journey, setJourney] = useState(null)
  const [journeyDetails, setJourneyDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchJourneyDetails = async () => {
      try {
        // Buscar detalhes da jornada do colaborador
        const employeeJourney = await employeeJourneyService.getByEmployeeId(id)
        setJourney(employeeJourney)
        
        // Buscar detalhes da jornada
        if (employeeJourney && employeeJourney.journeyId) {
          const journeyInfo = await employeeJourneyService.getJourneyById(employeeJourney.journeyId)
          setJourneyDetails(journeyInfo)
        }
        
        setLoading(false)
      } catch (err) {
        setError('Erro ao carregar os detalhes da jornada')
        setLoading(false)
      }
    }

    fetchJourneyDetails()
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

  if (!journey) {
    return (
      <div className="rounded-md bg-yellow-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Jornada não encontrada</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>A jornada solicitada não foi encontrada.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Detalhes da Jornada</h1>
          <p className="mt-2 text-sm text-gray-700">
            Informações detalhadas sobre a jornada do colaborador.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            to="/"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Voltar
          </Link>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <div className="bg-white px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <h3 className="text-sm font-medium leading-6 text-gray-900">Informações da Jornada</h3>
                    <div className="mt-2">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">ID do Colaborador</dt>
                          <dd className="mt-1 text-sm text-gray-900">{journey.employeeId}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">ID da Jornada</dt>
                          <dd className="mt-1 text-sm text-gray-900">{journey.journeyId}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Data de Início</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {new Date(journey.startDate).toLocaleString()}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Status</dt>
                          <dd className="mt-1">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              journey.status === 'completed' ? 'bg-green-100 text-green-800' :
                              journey.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {journey.status === 'completed' ? 'Concluída' :
                               journey.status === 'in_progress' ? 'Em Andamento' :
                               'Pendente'}
                            </span>
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {journeyDetails && (
        <div className="mt-8">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Ações da Jornada</h2>
          <div className="mt-4 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Tipo
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Descrição
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {journeyDetails.actions && journeyDetails.actions.map((action) => (
                        <tr key={action.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {action.type === 'email' ? 'E-mail' :
                             action.type === 'whatsapp' ? 'WhatsApp' :
                             action.type === 'api' ? 'API' : action.type}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {action.description || 'Sem descrição'}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              journey.completedActions && journey.completedActions.includes(action.id)
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {journey.completedActions && journey.completedActions.includes(action.id)
                                ? 'Concluída'
                                : 'Pendente'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 