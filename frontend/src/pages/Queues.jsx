import { useState, useEffect } from "react";
import axios from "axios";

export default function Queues() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/queues");
        setQueues(response.data);
        setLoading(false);
      } catch (err) {
        setError("Erro ao carregar filas");
        setLoading(false);
      }
    };

    fetchQueues();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Erro!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Filas de Processamento
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Lista de processos aguardando execução
        </p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          {queues.map((queue) => (
            <div
              key={queue.id}
              className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt className="text-sm font-medium text-gray-500">
                ID da Jornada
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {queue.journeyId}
              </dd>

              <dt className="text-sm font-medium text-gray-500">Ação</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {queue.action.type}
              </dd>

              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {queue.status}
              </dd>

              <dt className="text-sm font-medium text-gray-500">
                Data de Criação
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(queue.createdAt).toLocaleString()}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
