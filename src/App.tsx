import { useEffect, useState, useRef, FormEvent } from "react";
import { FiTrash } from "react-icons/fi";
import { api } from './services/api'

interface ClienteProps {
  id: string;
  name: string;
  idade: number;
  email: string;
}

export default function App() {
  const [clientes, setClientes] = useState<ClienteProps[]>([])
  const nameRef = useRef<HTMLInputElement | null>(null)
  const idadeRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    loadCliente();
  }, [])

  async function loadCliente() {
    const response = await api.get("/clientes")
    setClientes(response.data);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!nameRef.current?.value || !idadeRef.current?.value || !emailRef.current?.value) return;

    const response = await api.post("/cliente", {
      name: nameRef.current?.value,
      idade: idadeRef.current?.value,
      email: emailRef.current?.value
    })
   setClientes (allClientes => [...allClientes, response.data])
   nameRef.current.value = ""
   idadeRef.current.value = ""
   emailRef.current.value = ""
  }

  async function handleDelete(id: string) {
    try {
      await api.delete('/cliente', {
        params: {
          id: id,
        },
      })

      const allCustomers = clientes.filter(cliente => cliente.id !== id)
      setClientes(allCustomers)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4">
      <main className="my-10 w-full md:max-w-2x1">
        <h1 className="text-4x1 font-medium text-white">Clientes</h1>

        <form className="flex flex-col my-6" onSubmit={handleSubmit}>
          <label className="font-medium text-white">Nome:</label>
          <input type="text"
            placeholder="Digite seu nome completo..."
            className="w-full md-5 p-2 rounded"
            ref={nameRef}
          />

          <label className="font-medium text-white">Idade:</label>
          <input type="nunber"
            placeholder="Digite sua idade"
            className="w-full md-5 p-2 rounded"
            ref={idadeRef}
          />
          <label className="font-medium text-white">Email:</label>
          <input type="email"
            placeholder="Digite seu email completo..."
            className="w-full md-5 p-2 rounded"
            ref={emailRef}
          />
          <input type="submit" value="Cadastrar" className="cursor-pointer w-full p-2 bg-green-500 rounded font-medium" />
        </form>
        <section className="flex flex-col gap-4">
          {clientes.map((cliente) => (
            <article key={cliente.id} className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200">
              <p><span>Nome:</span> {cliente.name}</p>
              <p><span>Idade:</span> {cliente.idade}</p>
              <p><span>Email:</span> {cliente.email}</p>
              <button 
              className="bg-red-500 w-7 h-7 flex items-center justify-center rounded-lg absolute right-0 -bottom-2"
              onClick={()=> handleDelete(cliente.id)}
              >
                 
                <FiTrash size={18} color="#FFF" />
              </button>
            </article>
          ))}
        </section>
      </main>
    </div>

  )
}