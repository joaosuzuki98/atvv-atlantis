"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, Car, Bed, Snowflake, Home, Edit, Plus, Building } from "lucide-react"
import type { Accomadation } from "@/app/page"
import api from "@/lib/api"

interface AcomodacoesPageProps {
	acomodacoes: Accomadation[]
	setAcomodacoes: (acomodacoes: Accomadation[]) => void
	onFetch: () => void
}

export default function AcomodacoesPage({ acomodacoes, setAcomodacoes, onFetch }: AcomodacoesPageProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [editingAcomodacao, setEditingAcomodacao] = useState<Accomadation | null>(null)
	const [formData, setFormData] = useState({
		nomePacote: "",
		vagasGaragem: 0,
		camasSolteiro: 0,
		camasCasal: 0,
		climatizacao: false,
		numeroSuites: 0,
	})

	const resetForm = () => {
		setFormData({
			nomePacote: "",
			vagasGaragem: 0,
			camasSolteiro: 0,
			camasCasal: 0,
			climatizacao: false,
			numeroSuites: 0,
		})
		setEditingAcomodacao(null)
	}

	const handleEdit = (acomodacao: Accomadation) => {
		setEditingAcomodacao(acomodacao)
		setFormData({
			nomePacote: acomodacao.nomePacote,
			vagasGaragem: acomodacao.vagasGaragem,
			camasSolteiro: acomodacao.camasSolteiro,
			camasCasal: acomodacao.camasCasal,
			climatizacao: acomodacao.climatizacao,
			numeroSuites: acomodacao.numeroSuites,
		})
		setIsDialogOpen(true)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		try {
			if (editingAcomodacao) {
				const updated = { ...editingAcomodacao, ...formData }
				await api.put(`/acomodacoes/${editingAcomodacao.id}`, updated)
				// setAcomodacoes(acomodacoes.map((a) => (a.id === updated.id ? updated : a)))
			} else {
				const response = await api.post("/acomodacoes", formData)
				const newAcomodacao = response.data
				// setAcomodacoes([...acomodacoes, newAcomodacao])
			}
			onFetch()
			resetForm()
			setIsDialogOpen(false)
		} catch (err) {
			console.error("Erro ao salvar acomodação:", err)
		}
	}

	const removerAcomodacao = async (id: string) => {
		try {
			await api.delete(`/acomodacoes/${id}`)
			onFetch()
		} catch (err) {
			console.error(err)
		}
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
				<div>
					<h2 className="text-xl font-semibold text-white">Lista de Acomodações</h2>
					<p className="text-gray-400">Total: {acomodacoes.length} acomodações</p>
				</div>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button onClick={resetForm} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
							<Plus className="h-4 w-4 mr-2" />
							Nova Acomodação
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-[95vw] sm:max-w-2xl mx-auto fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
						<DialogHeader>
							<DialogTitle>{editingAcomodacao ? "Editar Acomodação" : "Cadastrar Nova Acomodação"}</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="nomePacote">Nome do Pacote</Label>
								<Input
									id="nomePacote"
									value={formData.nomePacote}
									onChange={(e) => setFormData({ ...formData, nomePacote: e.target.value })}
									placeholder="Ex: Suíte Master, Apartamento Família..."
									required
								/>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								<div className="space-y-2">
									<Label htmlFor="vagasGaragem">Vagas de Garagem</Label>
									<Input
										id="vagasGaragem"
										type="number"
										min="0"
										value={formData.vagasGaragem}
										onChange={(e) => setFormData({ ...formData, vagasGaragem: Number.parseInt(e.target.value) || 0 })}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="camasSolteiro">Camas de Solteiro</Label>
									<Input
										id="camasSolteiro"
										type="number"
										min="0"
										value={formData.camasSolteiro}
										onChange={(e) => setFormData({ ...formData, camasSolteiro: Number.parseInt(e.target.value) || 0 })}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="camasCasal">Camas de Casal</Label>
									<Input
										id="camasCasal"
										type="number"
										min="0"
										value={formData.camasCasal}
										onChange={(e) => setFormData({ ...formData, camasCasal: Number.parseInt(e.target.value) || 0 })}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="numeroSuites">Número de Suítes</Label>
									<Input
										id="numeroSuites"
										type="number"
										min="0"
										value={formData.numeroSuites}
										onChange={(e) => setFormData({ ...formData, numeroSuites: Number.parseInt(e.target.value) || 0 })}
									/>
								</div>

								<div className="flex items-center space-x-2">
									<Switch
										id="climatizacao"
										checked={formData.climatizacao}
										onCheckedChange={(checked) => setFormData({ ...formData, climatizacao: checked })}
									/>
									<Label htmlFor="climatizacao">Climatização</Label>
								</div>
							</div>

							<div className="flex gap-3">
								<Button type="submit" className="flex-1">
									{editingAcomodacao ? "Atualizar Acomodação" : "Cadastrar Acomodação"}
								</Button>
								<Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
									Cancelar
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
				{acomodacoes.length === 0 ? (
					<div className="col-span-full">
						<Card className="bg-gray-800 border-gray-700">
							<CardContent className="flex flex-col items-center justify-center py-12">
								<div className="text-gray-500 mb-4">
									<Building className="h-12 w-12" />
								</div>
								<h3 className="text-lg font-medium text-white mb-2">Nenhuma acomodação cadastrada</h3>
								<p className="text-gray-400 text-center mb-4">
									Cadastre acomodações para disponibilizar aos seus clientes.
								</p>
								<Button onClick={() => setIsDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
									<Plus className="h-4 w-4 mr-2" />
									Cadastrar Primeira Acomodação
								</Button>
							</CardContent>
						</Card>
					</div>
				) : (
					acomodacoes.map((acomodacao) => (
						<Card key={acomodacao.id} className="bg-gray-800 border-gray-700 hover:shadow-md transition-shadow">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-lg text-white">{acomodacao.nomePacote}</CardTitle>
								<div className="flex gap-2">
									<Button variant="outline" size="icon" onClick={() => handleEdit(acomodacao)}>
										<Edit className="h-4 w-4" />
									</Button>
									<Button variant="destructive" size="icon" onClick={() => removerAcomodacao(acomodacao.id)}>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div className="flex items-center gap-2">
										<Car className="h-4 w-4 text-gray-500" />
										<span className="text-sm text-gray-300">{acomodacao.vagasGaragem} vagas de garagem</span>
									</div>

									<div className="flex items-center gap-2">
										<Bed className="h-4 w-4 text-gray-500" />
										<span className="text-sm text-gray-300">
											{acomodacao.camasSolteiro} solteiro, {acomodacao.camasCasal} casal
										</span>
									</div>

									<div className="flex items-center gap-2">
										<Home className="h-4 w-4 text-gray-500" />
										<span className="text-sm text-gray-300">{acomodacao.numeroSuites} suítes</span>
									</div>

									<div className="flex items-center gap-2">
										<Snowflake className="h-4 w-4 text-gray-500" />
										<Badge variant={acomodacao.climatizacao ? "default" : "secondary"}>
											{acomodacao.climatizacao ? "Com climatização" : "Sem climatização"}
										</Badge>
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
