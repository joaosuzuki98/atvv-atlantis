"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, Calendar, User, Building, Edit, Plus } from "lucide-react"
import type { Customer, Housing } from "@/app/page"
import api from "@/lib/api"

interface HospedagensPageProps {
	hospedagens: Housing[]
	setHospedagens: (hospedagens: Housing[]) => void
	onFetch: () => void
}

export default function HospedagensPage({ hospedagens, setHospedagens, onFetch }: HospedagensPageProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [editingHospedagem, setEditingHospedagem] = useState<Housing | null>(null)
	const [titulares, setTitulares] = useState<Customer[]>([])
	const [formData, setFormData] = useState({
		clienteId: "",
		acomodacaoId: "",
		dataInicio: "",
		dataFim: "",
	})

	const fetchTitulares = async () => {
		try {
			const response = await api.get('/clientes/tipo/TITULAR')
			setTitulares(response.data)
		} catch (err) {
			console.error(err)
		}
	}

	const resetForm = () => {
		setFormData({
			clienteId: "",
			acomodacaoId: "",
			dataInicio: "",
			dataFim: "",
		})
		setEditingHospedagem(null)
	}

	const handleEdit = async (hospedagem: Housing) => {
		await fetchTitulares()

		setEditingHospedagem(hospedagem)
		setFormData({
			clienteId: hospedagem.cliente.id,
			acomodacaoId: hospedagem.acomodacao.id,
			dataInicio: hospedagem.dataInicio,
			dataFim: hospedagem.dataFim,
		})
		setIsDialogOpen(true)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (editingHospedagem) {
			try {
				const response = await api.put(`/hospedagens/${editingHospedagem.id}`, {
					clienteId: formData.clienteId,
					acomodacaoId: formData.acomodacaoId,
					dataInicio: formData.dataInicio,
					dataFim: formData.dataFim,
				})

				onFetch()
				setIsDialogOpen(false)
				resetForm()
			} catch (error) {
				console.error("Erro ao atualizar hospedagem:", error)
			}
		} else {
			try {
				const response = await api.post('/hospedagens', {
					clienteId: formData.clienteId,
					acomodacaoId: formData.acomodacaoId,
					dataInicio: formData.dataInicio,
					dataFim: formData.dataFim,
				})

				const novaHospedagem: Housing = response.data
				setHospedagens([...hospedagens, novaHospedagem])
				setIsDialogOpen(false)
				resetForm()
			} catch (error) {
				console.error("Erro ao cadastrar hospedagem:", error)
			}
		}
	}

	const removerHospedagem = async (id: string) => {
		try {
			await api.delete(`/hospedagens/${id}`)
			onFetch()
		} catch (err) {
			console.error(err)
		}
	}

	const formatarData = (data: string) => new Date(data).toLocaleDateString("pt-BR")

	const calcularDias = (inicio: string, fim: string) => {
		const d1 = new Date(inicio)
		const d2 = new Date(fim)
		return Math.ceil(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24))
	}

	const clientesUnicos = Array.from(new Map(hospedagens.map(h => [h.cliente.id, h.cliente])).values())
	const acomodacoesUnicas = Array.from(new Map(hospedagens.map(h => [h.acomodacao.id, h.acomodacao])).values())

	useEffect(() => {
		fetchTitulares()
	}, [])

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
				<div>
					<h2 className="text-xl font-semibold text-white">Lista de Hospedagens</h2>
					<p className="text-gray-400">Total: {hospedagens.length} hospedagens</p>
				</div>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button onClick={resetForm} className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto">
							<Plus className="h-4 w-4 mr-2" />
							Nova Hospedagem
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-[95vw] sm:max-w-2xl mx-auto fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
						<DialogHeader>
							<DialogTitle>{editingHospedagem ? "Editar Hospedagem" : "Cadastrar Nova Hospedagem"}</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label>Cliente</Label>
									<Select
										value={formData.clienteId}
										onValueChange={(value) => setFormData({ ...formData, clienteId: value })}
										required
									>
										<SelectTrigger>
											<SelectValue placeholder="Selecione um cliente" />
										</SelectTrigger>
										<SelectContent>
											{titulares.map((titular) => (
												<SelectItem 
													key={titular.id} 
													value={titular.id}
												>
													{titular.nome} ({titular.tipo || "Tipo não informado"})
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label>Acomodação</Label>
									<Select
										value={formData.acomodacaoId}
										onValueChange={(value) => setFormData({ ...formData, acomodacaoId: value })}
										required
									>
										<SelectTrigger>
											<SelectValue placeholder="Selecione uma acomodação" />
										</SelectTrigger>
										<SelectContent>
											{acomodacoesUnicas.map((acomodacao) => (
												<SelectItem key={acomodacao.id} value={acomodacao.id}>
													{acomodacao.nomePacote}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="dataInicio">Data de Início</Label>
									<Input
										id="dataInicio"
										type="date"
										value={formData.dataInicio}
										onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="dataFim">Data de Fim</Label>
									<Input
										id="dataFim"
										type="date"
										value={formData.dataFim}
										onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
										required
										min={formData.dataInicio}
									/>
								</div>
							</div>

							{formData.dataInicio && formData.dataFim && (
								<div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
									<p className="text-sm text-blue-700 font-medium">
										Duração da hospedagem: {calcularDias(formData.dataInicio, formData.dataFim)} dias
									</p>
								</div>
							)}

							<div className="flex gap-3">
								<Button type="submit" className="flex-1" disabled={clientesUnicos.length === 0 || acomodacoesUnicas.length === 0}>
									{clientesUnicos.length === 0 || acomodacoesUnicas.length === 0
										? "Cadastre clientes e acomodações primeiro"
										: editingHospedagem
											? "Atualizar Hospedagem"
											: "Cadastrar Hospedagem"}
								</Button>
								<Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
									Cancelar
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<div className="space-y-4">
				{hospedagens.length === 0 ? (
					<Card className="bg-gray-800 border-gray-700">
						<CardContent className="flex flex-col items-center justify-center py-12">
							<div className="text-gray-500 mb-4">
								<Calendar className="h-12 w-12" />
							</div>
							<h3 className="text-lg font-medium text-white mb-2">Nenhuma hospedagem cadastrada</h3>
							<p className="text-gray-400 text-center mb-4">
								Registre hospedagens vinculando clientes às acomodações disponíveis.
							</p>
							<Button
								onClick={() => setIsDialogOpen(true)}
								className="bg-orange-600 hover:bg-orange-700"
								disabled={clientesUnicos.length === 0 || acomodacoesUnicas.length === 0}
							>
								<Plus className="h-4 w-4 mr-2" />
								{clientesUnicos.length === 0 || acomodacoesUnicas.length === 0
									? "Cadastre clientes e acomodações primeiro"
									: "Cadastrar Primeira Hospedagem"}
							</Button>
						</CardContent>
					</Card>
				) : (
					hospedagens.map((hospedagem) => (
						<Card key={hospedagem.id} className="bg-gray-800 border-gray-700 hover:shadow-md transition-shadow">
							<CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
								<div className="flex flex-col sm:flex-row sm:items-center gap-3">
									<CardTitle className="text-lg text-white">Hospedagem #{hospedagem.id.slice(-4)}</CardTitle>
									<Badge variant={new Date(hospedagem.dataFim) >= new Date() ? "default" : "secondary"}>
										{new Date(hospedagem.dataFim) >= new Date() ? "Ativa" : "Finalizada"}
									</Badge>
								</div>
								<div className="flex gap-2">
									<Button variant="outline" size="icon" onClick={() => handleEdit(hospedagem)}>
										<Edit className="h-4 w-4" />
									</Button>
									<Button variant="destructive" size="icon" onClick={() => removerHospedagem(hospedagem.id)}>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
									<div className="flex items-center gap-3">
										<User className="h-5 w-5 text-gray-500" />
										<div>
											<p className="font-medium text-white">{hospedagem.cliente.nome}</p>
											<p className="text-sm text-gray-400">Cliente</p>
										</div>
									</div>

									<div className="flex items-center gap-3">
										<Building className="h-5 w-5 text-gray-500" />
										<div>
											<p className="font-medium text-white">{hospedagem.acomodacao.nomePacote}</p>
											<p className="text-sm text-gray-400">Acomodação</p>
										</div>
									</div>

									<div className="flex items-center gap-3">
										<Calendar className="h-5 w-5 text-gray-500" />
										<div>
											<p className="font-medium text-white">
												{formatarData(hospedagem.dataInicio)} - {formatarData(hospedagem.dataFim)}
											</p>
											<p className="text-sm text-gray-400">
												{calcularDias(hospedagem.dataInicio, hospedagem.dataFim)} dias
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>
		</div>
	)
}
