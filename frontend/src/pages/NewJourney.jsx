import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { journeyService } from "../services/api";

export default function NewJourney() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    actions: [
      {
        type: "email",
        description: "",
        config: {
          to: "",
          subject: "",
          body: "",
        },
      },
    ],
  });
  const [jsonErrors, setJsonErrors] = useState({});
  const [rawJsonValues, setRawJsonValues] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await journeyService.create(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao criar a jornada");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateJson = (value) => {
    if (!value) return true;
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleActionChange = (index, field, value) => {
    setFormData((prev) => {
      const newActions = [...prev.actions];

      // Se o tipo da ação mudou, redefinir a configuração
      if (field === "type") {
        const newConfig = {
          email: { to: "", subject: "", body: "" },
          whatsapp: { to: "", message: "" },
          api: { url: "", method: "POST", headers: {}, body: {} },
        }[value];

        newActions[index] = {
          ...newActions[index],
          type: value,
          config: newConfig,
        };
      } else if (field.includes(".")) {
        const [parent, child] = field.split(".");
        newActions[index] = {
          ...newActions[index],
          [parent]: {
            ...newActions[index][parent],
            [child]: value,
          },
        };
      } else {
        newActions[index] = {
          ...newActions[index],
          [field]: value,
        };
      }
      return {
        ...prev,
        actions: newActions,
      };
    });

    // Atualiza os erros de JSON
    if (field === "config.headers" || field === "config.body") {
      setJsonErrors((prev) => ({
        ...prev,
        [`${field}-${index}`]: !validateJson(value),
      }));
    }
  };

  const handleJsonBlur = (index, field, value) => {
    try {
      const parsed = value ? JSON.parse(value) : null;
      const formatted = value ? JSON.stringify(parsed, null, 2) : "";
      setRawJsonValues((prev) => ({
        ...prev,
        [`${field}-${index}`]: formatted,
      }));
      handleActionChange(index, field, parsed);
    } catch (err) {
      // Mantém o valor original se o JSON for inválido
      setRawJsonValues((prev) => ({
        ...prev,
        [`${field}-${index}`]: value,
      }));
    }
  };

  const addAction = () => {
    setFormData((prev) => ({
      ...prev,
      actions: [
        ...prev.actions,
        {
          type: "email",
          description: "",
          config: {
            to: "",
            subject: "",
            body: "",
          },
        },
      ],
    }));
  };

  const removeAction = (index) => {
    setFormData((prev) => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Nova Jornada</h1>
          <p className="mt-2 text-sm text-gray-700">
            Crie uma nova jornada com suas ações.
          </p>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <form
                onSubmit={handleSubmit}
                className="bg-white px-4 py-5 sm:p-6"
              >
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Nome
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        required
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Descrição
                    </label>
                    <div className="mt-2">
                      <textarea
                        name="description"
                        id="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                      Ações
                    </h2>
                    <button
                      type="button"
                      onClick={addAction}
                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Adicionar Ação
                    </button>
                  </div>

                  <div className="mt-4 space-y-6">
                    {formData.actions.map((action, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-gray-200 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">
                            Ação {index + 1}
                          </h3>
                          <button
                            type="button"
                            onClick={() => removeAction(index)}
                            className="text-sm font-medium text-red-600 hover:text-red-500"
                          >
                            Remover
                          </button>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                          <div className="sm:col-span-3">
                            <label
                              htmlFor={`action-type-${index}`}
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Tipo
                            </label>
                            <div className="mt-2">
                              <select
                                id={`action-type-${index}`}
                                value={action.type}
                                onChange={(e) =>
                                  handleActionChange(
                                    index,
                                    "type",
                                    e.target.value
                                  )
                                }
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                required
                              >
                                <option value="email">E-mail</option>
                                <option value="whatsapp">WhatsApp</option>
                                <option value="api">API</option>
                              </select>
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label
                              htmlFor={`action-description-${index}`}
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Descrição
                            </label>
                            <div className="mt-2">
                              <input
                                type="text"
                                id={`action-description-${index}`}
                                value={action.description}
                                onChange={(e) =>
                                  handleActionChange(
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                required
                              />
                            </div>
                          </div>

                          {action.type === "email" && (
                            <>
                              <div className="sm:col-span-3">
                                <label
                                  htmlFor={`action-to-${index}`}
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Para
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="email"
                                    id={`action-to-${index}`}
                                    value={action.config.to}
                                    onChange={(e) =>
                                      handleActionChange(
                                        index,
                                        "config.to",
                                        e.target.value
                                      )
                                    }
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    required
                                  />
                                </div>
                              </div>

                              <div className="sm:col-span-3">
                                <label
                                  htmlFor={`action-subject-${index}`}
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Assunto
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    id={`action-subject-${index}`}
                                    value={action.config.subject}
                                    onChange={(e) =>
                                      handleActionChange(
                                        index,
                                        "config.subject",
                                        e.target.value
                                      )
                                    }
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    required
                                  />
                                </div>
                              </div>

                              <div className="sm:col-span-6">
                                <label
                                  htmlFor={`action-body-${index}`}
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Conteúdo
                                </label>
                                <div className="mt-2">
                                  <textarea
                                    id={`action-body-${index}`}
                                    value={action.config.body}
                                    onChange={(e) =>
                                      handleActionChange(
                                        index,
                                        "config.body",
                                        e.target.value
                                      )
                                    }
                                    rows={3}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    required
                                  />
                                </div>
                              </div>
                            </>
                          )}

                          {action.type === "whatsapp" && (
                            <>
                              <div className="sm:col-span-3">
                                <label
                                  htmlFor={`action-to-${index}`}
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Número
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    id={`action-to-${index}`}
                                    value={action.config.to}
                                    onChange={(e) =>
                                      handleActionChange(
                                        index,
                                        "config.to",
                                        e.target.value
                                      )
                                    }
                                    placeholder="+5511999999999"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    required
                                  />
                                </div>
                              </div>

                              <div className="sm:col-span-6">
                                <label
                                  htmlFor={`action-message-${index}`}
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Mensagem
                                </label>
                                <div className="mt-2">
                                  <textarea
                                    id={`action-message-${index}`}
                                    value={action.config.message}
                                    onChange={(e) =>
                                      handleActionChange(
                                        index,
                                        "config.message",
                                        e.target.value
                                      )
                                    }
                                    rows={3}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    required
                                  />
                                </div>
                              </div>
                            </>
                          )}

                          {action.type === "api" && (
                            <>
                              <div className="sm:col-span-3">
                                <label
                                  htmlFor={`action-url-${index}`}
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  URL
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="url"
                                    id={`action-url-${index}`}
                                    value={action.config.url}
                                    onChange={(e) =>
                                      handleActionChange(
                                        index,
                                        "config.url",
                                        e.target.value
                                      )
                                    }
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    required
                                  />
                                </div>
                              </div>

                              <div className="sm:col-span-3">
                                <label
                                  htmlFor={`action-method-${index}`}
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Método
                                </label>
                                <div className="mt-2">
                                  <select
                                    id={`action-method-${index}`}
                                    value={action.config.method}
                                    onChange={(e) =>
                                      handleActionChange(
                                        index,
                                        "config.method",
                                        e.target.value
                                      )
                                    }
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    required
                                  >
                                    <option value="GET">GET</option>
                                    <option value="POST">POST</option>
                                    <option value="PUT">PUT</option>
                                    <option value="DELETE">DELETE</option>
                                    <option value="PATCH">PATCH</option>
                                  </select>
                                </div>
                              </div>

                              <div className="sm:col-span-6">
                                <label
                                  htmlFor={`action-headers-${index}`}
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Headers
                                </label>
                                <div className="mt-2">
                                  <textarea
                                    id={`action-headers-${index}`}
                                    value={
                                      rawJsonValues[
                                        `config.headers-${index}`
                                      ] ||
                                      JSON.stringify(
                                        action.config.headers,
                                        null,
                                        2
                                      )
                                    }
                                    onChange={(e) =>
                                      handleActionChange(
                                        index,
                                        "config.headers",
                                        e.target.value
                                      )
                                    }
                                    onBlur={(e) =>
                                      handleJsonBlur(
                                        index,
                                        "config.headers",
                                        e.target.value
                                      )
                                    }
                                    rows={3}
                                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                                      jsonErrors[`config.headers-${index}`]
                                        ? "ring-red-300"
                                        : "ring-gray-300"
                                    } focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                                  />
                                </div>
                              </div>

                              <div className="sm:col-span-6">
                                <label
                                  htmlFor={`action-body-${index}`}
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Body
                                </label>
                                <div className="mt-2">
                                  <textarea
                                    id={`action-body-${index}`}
                                    value={
                                      rawJsonValues[`config.body-${index}`] ||
                                      JSON.stringify(
                                        action.config.body,
                                        null,
                                        2
                                      )
                                    }
                                    onChange={(e) =>
                                      handleActionChange(
                                        index,
                                        "config.body",
                                        e.target.value
                                      )
                                    }
                                    onBlur={(e) =>
                                      handleJsonBlur(
                                        index,
                                        "config.body",
                                        e.target.value
                                      )
                                    }
                                    rows={3}
                                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                                      jsonErrors[`config.body-${index}`]
                                        ? "ring-red-300"
                                        : "ring-gray-300"
                                    } focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                                  />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

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
                          <p>Jornada criada com sucesso! Redirecionando...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    Cancelar
                  </button>
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
        </div>
      </div>
    </div>
  );
}
