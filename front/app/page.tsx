"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import ClientesPage from "@/components/clientes-page"
import AcomodacoesPage from "@/components/acomodacoes-page"
import HospedagensPage from "@/components/hospedagens-page"
import Dashboard from "@/components/dashboard"
import api from "@/lib/api"

export type Accomadation = {
	id: string
	nomePacote: string
	camasCasal: number
	camasSolteiro: number
	numeroSuites: number
	vagasGaragem: number
	climatizacao: boolean
}

export type Customer = {
	id: string
	nome: string
	nomeSocial?: string
	dataNascimento?: string
	tipo: "TITULAR" | "DEPENDENTE"
	titularId?: string
	dependentes?: Customer[]
	endereco?: Address
	documentos?: Document[]
	telefones?: Phone[]
}

export type Document = {
	id: string
	tipo: "RG" | "CPF" | "PASSAPORTE"
	numero: string
	dataEmissao: Date
}

export type Address = {
	id: string
	rua: string
	cidade: string
	bairro: string
	estado: string
	cep: string
	numero: string
}

export type Phone = {
	id: string
	ddd: string
	numero: string
}

export type Housing = {
	id: string
	cliente: Customer
	acomodacao: Accomadation
	dataInicio: string
	dataFim: string
}

export default function Home() {
	const [activeTab, setActiveTab] = useState("dashboard")
	const renderContent = () => {
		switch (activeTab) {
			case "dashboard":
				return <Dashboard clientes={customers} acomodacoes={accomadations} hospedagens={housings} />
			case "clientes":
				return <ClientesPage clientes={customers} setClientes={setCustomers} onFetch={fetchCustomer} />
			case "acomodacoes":
				return <AcomodacoesPage acomodacoes={accomadations} setAcomodacoes={setAccomadations} onFetch={fetchAccomadations} />
			case "hospedagens":
				return (
					<HospedagensPage
						hospedagens={housings}
						setHospedagens={setHousings}
						onFetch={fetchHousings}
					/>
				)
			default:
				return <Dashboard clientes={customers} acomodacoes={accomadations} hospedagens={housings} />
		}
	}

	const [accomadations, setAccomadations] = useState<Accomadation[]>([])
	const [customers, setCustomers] = useState<Customer[]>([])
	const [housings, setHousings] = useState<Housing[]>([])

	const fetchAccomadations = async () => {
		try {
			const response = await api.get('/acomodacoes')
			setAccomadations(response.data)
		} catch (err) {
			console.error(err)
		}
	}

	const fetchCustomer = async () => {
		try {
			const response = await api.get('/clientes')
			setCustomers(response.data)
		} catch (err) {
			console.error(err)
		}
	}

	const fetchHousings = async () => {
		try {
			const response = await api.get('/hospedagens')
			setHousings(response.data)
		} catch (err) {
			console.error(err)
		}
	}

	useEffect(() => {
		fetchAccomadations()
		fetchCustomer()
		fetchHousings()
	}, [])

	return (
		<div className="flex flex-col lg:flex-row h-screen bg-gray-900">
			<Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
			<div className="flex-1 flex flex-col overflow-hidden">
				<Header activeTab={activeTab} />
				<main className="flex-1 overflow-y-auto p-3 sm:p-6 bg-gray-900">{renderContent()}</main>
			</div>
		</div>
	)
}
