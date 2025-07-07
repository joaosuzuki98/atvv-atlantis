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
import { Trash2, Plus, Minus } from "lucide-react"
import type { Cliente } from "@/app/page"

interface ClientesTabProps {
	clientes: Cliente[]
	setClientes: (clientes: Cliente[]) => void
}

export default function ClientesTab({ clientes, setClientes }: ClientesTabProps) {
	const [formData, setFormData] = useState({
		nome: "",
		telefones: [""],
		endereco: {
			rua: "",
			numero: "",
			bairro: "",
			cidade: "",
			cep: "",
		},
		documentos: {
			rg: "",
			cpf: "",
			passaporte: "",
		},
		tipo: "titular" as "titular" | "dependente",
		titularId: "",
	})

	const titulares = clientes.filter((c) => c.tipo === "titular")

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		const novoCliente: Cliente = {
			id: Date.now().toString(),
			...formData,
			telefones: formData.telefones.filter((t) => t.trim() !== ""),
		}

		// Se for dependente, herda telefones e endereço do titular
		if (formData.tipo === "dependente" && formData.titularId) {
			const titular = clientes.find((c) => c.id === formData.titularId)
			if (titular) {
				novoCliente.telefones = titular.telefones
				novoCliente.endereco = titular.endereco
			}
		}

		setClientes([...clientes, novoCliente])

		// Reset form
		setFormData({
			nome: "",
			telefones: [""],
			endereco: {
				rua: "",
				numero: "",
				bairro: "",
				cidade: "",
				cep: "",
			},
			documentos: {
				rg: "",
				cpf: "",
				passaporte: "",
			},
			tipo: "titular",
			titularId: "",
		})
	}

	const adicionarTelefone = () => {
		setFormData({
			...formData,
			telefones: [...formData.telefones, ""],
		})
	}

	const removerTelefone = (index: number) => {
		const novosTelefones = formData.telefones.filter((_, i) => i !== index)
		setFormData({
			...formData,
			telefones: novosTelefones.length > 0 ? novosTelefones : [""],
		})
	}

	const atualizarTelefone = (index: number, valor: string) => {
		const novosTelefones = [...formData.telefones]
		novosTelefones[index] = valor
		setFormData({
			...formData,
			telefones: novosTelefones,
		})
	}

	const removerCliente = (id: string) => {
		setClientes(clientes.filter((c) => c.id !== id))
	}

	return (
		<Tabs defaultValue="cadastro" className="space-y-6">
			<TabsList>
				<TabsTrigger value="cadastro">Cadastrar Cliente</TabsTrigger>
				<TabsTrigger value="lista">Lista de Clientes</TabsTrigger>
			</TabsList>

			<TabsContent value="cadastro">
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="nome">Nome Completo</Label>
							<Input
								id="nome"
								value={formData.nome}
								onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="tipo">Tipo de Cliente</Label>
							<Select
								value={formData.tipo}
								onValueChange={(value: "titular" | "dependente") => setFormData({ ...formData, tipo: value })}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="titular">Titular</SelectItem>
									<SelectItem value="dependente">Dependente</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{formData.tipo === "dependente" && (
						<div className="space-y-2">
							<Label htmlFor="titular">Titular Responsável</Label>
							<Select
								value={formData.titularId}
								onValueChange={(value) => setFormData({ ...formData, titularId: value })}
								required
							>
								<SelectTrigger>
									<SelectValue placeholder="Selecione o titular" />
								</SelectTrigger>
								<SelectContent>
									{titulares.map((titular) => (
										<SelectItem key={titular.id} value={titular.id}>
											{titular.nome}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<Label>Telefones</Label>
							<Button type="button" variant="outline" size="sm" onClick={adicionarTelefone}>
								<Plus className="h-4 w-4 mr-2" />
								Adicionar
							</Button>
						</div>
						{formData.telefones.map((telefone, index) => (
							<div key={index} className="flex gap-2">
								<Input
									value={telefone}
									onChange={(e) => atualizarTelefone(index, e.target.value)}
									placeholder="(00) 00000-0000"
									disabled={formData.tipo === "dependente"}
								/>
								{formData.telefones.length > 1 && formData.tipo === "titular" && (
									<Button type="button" variant="outline" size="icon" onClick={() => removerTelefone(index)}>
										<Minus className="h-4 w-4" />
									</Button>
								)}
							</div>
						))}
						{formData.tipo === "dependente" && (
							<p className="text-sm text-muted-foreground">Dependentes herdam os telefones do titular</p>
						)}
					</div>

					<div className="space-y-4">
						<Label className="text-base font-semibold">Endereço</Label>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="rua">Rua</Label>
								<Input
									id="rua"
									value={formData.endereco.rua}
									onChange={(e) =>
										setFormData({
											...formData,
											endereco: { ...formData.endereco, rua: e.target.value },
										})
									}
									disabled={formData.tipo === "dependente"}
									required={formData.tipo === "titular"}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="numero">Número</Label>
								<Input
									id="numero"
									value={formData.endereco.numero}
									onChange={(e) =>
										setFormData({
											...formData,
											endereco: { ...formData.endereco, numero: e.target.value },
										})
									}
									disabled={formData.tipo === "dependente"}
									required={formData.tipo === "titular"}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="bairro">Bairro</Label>
								<Input
									id="bairro"
									value={formData.endereco.bairro}
									onChange={(e) =>
										setFormData({
											...formData,
											endereco: { ...formData.endereco, bairro: e.target.value },
										})
									}
									disabled={formData.tipo === "dependente"}
									required={formData.tipo === "titular"}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="cidade">Cidade</Label>
								<Input
									id="cidade"
									value={formData.endereco.cidade}
									onChange={(e) =>
										setFormData({
											...formData,
											endereco: { ...formData.endereco, cidade: e.target.value },
										})
									}
									disabled={formData.tipo === "dependente"}
									required={formData.tipo === "titular"}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="cep">CEP</Label>
								<Input
									id="cep"
									value={formData.endereco.cep}
									onChange={(e) =>
										setFormData({
											...formData,
											endereco: { ...formData.endereco, cep: e.target.value },
										})
									}
									disabled={formData.tipo === "dependente"}
									required={formData.tipo === "titular"}
								/>
							</div>
						</div>
						{formData.tipo === "dependente" && (
							<p className="text-sm text-muted-foreground">Dependentes herdam o endereço do titular</p>
						)}
					</div>

					<div className="space-y-4">
						<Label className="text-base font-semibold">Documentos</Label>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label htmlFor="rg">RG</Label>
								<Input
									id="rg"
									value={formData.documentos.rg}
									onChange={(e) =>
										setFormData({
											...formData,
											documentos: { ...formData.documentos, rg: e.target.value },
										})
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="cpf">CPF</Label>
								<Input
									id="cpf"
									value={formData.documentos.cpf}
									onChange={(e) =>
										setFormData({
											...formData,
											documentos: { ...formData.documentos, cpf: e.target.value },
										})
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="passaporte">Passaporte</Label>
								<Input
									id="passaporte"
									value={formData.documentos.passaporte}
									onChange={(e) =>
										setFormData({
											...formData,
											documentos: { ...formData.documentos, passaporte: e.target.value },
										})
									}
								/>
							</div>
						</div>
					</div>

					<Button type="submit" className="w-full">
						Cadastrar Cliente
					</Button>
				</form>
			</TabsContent>

			<TabsContent value="lista">
				<div className="space-y-4">
					{clientes.length === 0 ? (
						<p className="text-center text-muted-foreground py-8">Nenhum cliente cadastrado ainda.</p>
					) : (
						clientes.map((cliente) => (
							<Card key={cliente.id}>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<div>
										<CardTitle className="text-lg">{cliente.nome}</CardTitle>
										<div className="flex gap-2 mt-2">
											<Badge variant={cliente.tipo === "titular" ? "default" : "secondary"}>{cliente.tipo}</Badge>
											{cliente.tipo === "dependente" && cliente.titularId && (
												<Badge variant="outline">
													Titular: {clientes.find((c) => c.id === cliente.titularId)?.nome}
												</Badge>
											)}
										</div>
									</div>
									<Button variant="destructive" size="icon" onClick={() => removerCliente(cliente.id)}>
										<Trash2 className="h-4 w-4" />
									</Button>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
										<div>
											<strong>Telefones:</strong>
											<ul className="list-disc list-inside ml-2">
												{cliente.telefones.map((tel, idx) => (
													<li key={idx}>{tel}</li>
												))}
											</ul>
										</div>
										<div>
											<strong>Endereço:</strong>
											<p className="ml-2">
												{cliente.endereco.rua}, {cliente.endereco.numero}
												<br />
												{cliente.endereco.bairro} - {cliente.endereco.cidade}
												<br />
												CEP: {cliente.endereco.cep}
											</p>
										</div>
										<div>
											<strong>Documentos:</strong>
											<div className="ml-2">
												{cliente.documentos.rg && <p>RG: {cliente.documentos.rg}</p>}
												{cliente.documentos.cpf && <p>CPF: {cliente.documentos.cpf}</p>}
												{cliente.documentos.passaporte && <p>Passaporte: {cliente.documentos.passaporte}</p>}
											</div>
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
