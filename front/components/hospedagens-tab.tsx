"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Calendar, User, Building } from "lucide-react"
import type { Cliente, Acomodacao, Hospedagem } from "@/app/page"

interface HospedagensTabProps {
	hospedagens: Hospedagem[]
	setHospedagens: (hospedagens: Hospedagem[]) => void
	clientes: Cliente[]
	acomodacoes: Acomodacao[]
}

export default function HospedagensTab({ hospedagens, setHospedagens, clientes, acomodacoes }: HospedagensTabProps) {
	const [formData, setFormData] = useState({
		clienteId: "",
		acomodacaoId: "",
		dataInicio: "",
		dataFim: "",
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		const novaHospedagem: Hospedagem = {
			id: Date.now().toString(),
			...formData,
		}

		setHospedagens([...hospedagens, novaHospedagem])

		setFormData({
			clienteId: "",
			acomodacaoId: "",
			dataInicio: "",
			dataFim: "",
		})
	}

	const removerHospedagem = (id: string) => {
		setHospedagens(hospedagens.filter((h) => h.id !== id))
	}

	const getClienteNome = (clienteId: string) => {
		const cliente = clientes.find((c) => c.id === clienteId)
		return cliente ? cliente.nome : "Cliente não encontrado"
	}

	const getAcomodacaoNome = (acomodacaoId: string) => {
		const acomodacao = acomodacoes.find((a) => a.id === acomodacaoId)
		return acomodacao ? acomodacao.nomePacote : "Acomodação não encontrada"
	}

	const formatarData = (data: string) => {
		return new Date(data).toLocaleDateString("pt-BR")
	}

	const calcularDias = (inicio: string, fim: string) => {
		const dataInicio = new Date(inicio)
		const dataFim = new Date(fim)
		const diffTime = Math.abs(dataFim.getTime() - dataInicio.getTime())
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
		return diffDays
	}

	return (
		<Tabs defaultValue="cadastro" className="space-y-6">
			<TabsList>
				<TabsTrigger value="cadastro">Cadastrar Hospedagem</TabsTrigger>
				<TabsTrigger value="lista">Lista de Hospedagens</TabsTrigger>
			</TabsList>

			<TabsContent value="cadastro">
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="cliente">Cliente</Label>
							<Select
								value={formData.clienteId}
								onValueChange={(value) => setFormData({ ...formData, clienteId: value })}
								required
							>
								<SelectTrigger>
									<SelectValue placeholder="Selecione um cliente" />
								</SelectTrigger>
								<SelectContent>
									{clientes.map((cliente) => (
										<SelectItem key={cliente.id} value={cliente.id}>
											{cliente.nome} ({cliente.tipo})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="acomodacao">Acomodação</Label>
							<Select
								value={formData.acomodacaoId}
								onValueChange={(value) => setFormData({ ...formData, acomodacaoId: value })}
								required
							>
								<SelectTrigger>
									<SelectValue placeholder="Selecione uma acomodação" />
								</SelectTrigger>
								<SelectContent>
									{acomodacoes.map((acomodacao) => (
										<SelectItem key={acomodacao.id} value={acomodacao.id}>
											{acomodacao.nomePacote}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
						<div className="p-4 bg-muted rounded-lg">
							<p className="text-sm text-muted-foreground">
								Duração da hospedagem: {calcularDias(formData.dataInicio, formData.dataFim)} dias
							</p>
						</div>
					)}

					<Button type="submit" className="w-full" disabled={clientes.length === 0 || acomodacoes.length === 0}>
						{clientes.length === 0 || acomodacoes.length === 0
							? "Cadastre clientes e acomodações primeiro"
							: "Cadastrar Hospedagem"}
					</Button>
				</form>
			</TabsContent>

			<TabsContent value="lista">
				<div className="space-y-4">
					{hospedagens.length === 0 ? (
						<p className="text-center text-muted-foreground py-8">Nenhuma hospedagem cadastrada ainda.</p>
					) : (
						hospedagens.map((hospedagem) => (
							<Card key={hospedagem.id}>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-lg">Hospedagem #{hospedagem.id.slice(-4)}</CardTitle>
									<Button variant="destructive" size="icon" onClick={() => removerHospedagem(hospedagem.id)}>
										<Trash2 className="h-4 w-4" />
									</Button>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-3">
											<div className="flex items-center gap-2">
												<User className="h-4 w-4 text-muted-foreground" />
												<div>
													<p className="font-medium">{getClienteNome(hospedagem.clienteId)}</p>
													<p className="text-sm text-muted-foreground">Cliente</p>
												</div>
											</div>

											<div className="flex items-center gap-2">
												<Building className="h-4 w-4 text-muted-foreground" />
												<div>
													<p className="font-medium">{getAcomodacaoNome(hospedagem.acomodacaoId)}</p>
													<p className="text-sm text-muted-foreground">Acomodação</p>
												</div>
											</div>
										</div>

										<div className="space-y-3">
											<div className="flex items-center gap-2">
												<Calendar className="h-4 w-4 text-muted-foreground" />
												<div>
													<p className="font-medium">
														{formatarData(hospedagem.dataInicio)} - {formatarData(hospedagem.dataFim)}
													</p>
													<p className="text-sm text-muted-foreground">
														{calcularDias(hospedagem.dataInicio, hospedagem.dataFim)} dias
													</p>
												</div>
											</div>

											<Badge variant="outline">
												{new Date(hospedagem.dataFim) >= new Date() ? "Ativa" : "Finalizada"}
											</Badge>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</div>
			</TabsContent>
		</Tabs>
	)
}
