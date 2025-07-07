"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, Plus, Minus, Edit, UserPlus, FileText, Calendar, Users } from "lucide-react"
import type { Customer, Phone } from "@/app/page"
import api from "@/lib/api"

interface ClientesPageProps {
	clientes: Customer[]
	setClientes: (clientes: Customer[]) => void
	onFetch: () => void
}

const estadosBrasil = [
	{ value: "AC", label: "Acre" },
	{ value: "AL", label: "Alagoas" },
	{ value: "AP", label: "Amapá" },
	{ value: "AM", label: "Amazonas" },
	{ value: "BA", label: "Bahia" },
	{ value: "CE", label: "Ceará" },
	{ value: "DF", label: "Distrito Federal" },
	{ value: "ES", label: "Espírito Santo" },
	{ value: "GO", label: "Goiás" },
	{ value: "MA", label: "Maranhão" },
	{ value: "MT", label: "Mato Grosso" },
	{ value: "MS", label: "Mato Grosso do Sul" },
	{ value: "MG", label: "Minas Gerais" },
	{ value: "PA", label: "Pará" },
	{ value: "PB", label: "Paraíba" },
	{ value: "PR", label: "Paraná" },
	{ value: "PE", label: "Pernambuco" },
	{ value: "PI", label: "Piauí" },
	{ value: "RJ", label: "Rio de Janeiro" },
	{ value: "RN", label: "Rio Grande do Norte" },
	{ value: "RS", label: "Rio Grande do Sul" },
	{ value: "RO", label: "Rondônia" },
	{ value: "RR", label: "Roraima" },
	{ value: "SC", label: "Santa Catarina" },
	{ value: "SP", label: "São Paulo" },
	{ value: "SE", label: "Sergipe" },
	{ value: "TO", label: "Tocantins" },
]

export default function ClientesPage({ clientes, setClientes, onFetch }: ClientesPageProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [editingCliente, setEditingCliente] = useState<Customer | null>(null)
	const [formData, setFormData] = useState({
		nome: "",
		nomeSocial: "",
		dataNascimento: "",
		telefones: [""],
		endereco: {
			rua: "",
			numero: "",
			bairro: "",
			cidade: "",
			estado: "",
			cep: "",
		},
		documentos: [
			{
				id: "",
				tipo: "RG" as const,
				numero: "",
				dataEmissao: "",
			},
		],
		tipo: "TITULAR" as "TITULAR" | "DEPENDENTE",
		titularId: "",
		dependentes: [] as Array<{
			id: string
			nome: string
			nomeSocial: string
			dataNascimento: string
			documentos: Array<{
				id: string
				tipo: "RG" | "CPF" | "Passaporte"
				numero: string
				dataEmissao: string
			}>
		}>,
	})

	const titulares = clientes.filter((c) => c.tipo === "TITULAR")

	const resetForm = () => {
		setFormData({
			nome: "",
			nomeSocial: "",
			dataNascimento: "",
			telefones: [""],
			endereco: {
				rua: "",
				numero: "",
				bairro: "",
				cidade: "",
				estado: "",
				cep: "",
			},
			documentos: [
				{
					id: "",
					tipo: "RG",
					numero: "",
					dataEmissao: "",
				},
			],
			tipo: "TITULAR",
			titularId: "",
			dependentes: [],
		})
		setEditingCliente(null)
	}

	const handleEdit = (cliente: Customer) => {
		setEditingCliente(cliente)
		setFormData({
			nome: cliente.nome,
			nomeSocial: cliente.nomeSocial || "",
			dataNascimento: cliente.dataNascimento,
			telefones:
				cliente.telefones.length > 0
					? cliente.telefones.map((t) => `${t.ddd}${t.numero}`)
					: [""],			
			endereco: cliente.endereco,
			documentos: cliente.documentos.map((doc) => ({
				...doc,
			})),
			tipo: cliente.tipo === "DEPENDENTE" ? "DEPENDENTE" : "TITULAR",
			titularId: cliente.titularId || "",
			dependentes:
				cliente.dependentes?.map((dep) => ({
					id: dep.id,
					nome: dep.nome,
					nomeSocial: dep.nomeSocial || "",
					dataNascimento: dep.dataNascimento,
					documentos: dep.documentos?.map((doc) => ({
						...doc,
					})),
				})) || [],
		})
		setIsDialogOpen(true)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		const parseTelefone = (telefone: string) => {
			const match = telefone.match(/^(\d{2})(\d{4,5}-?\d{4})$/)
			if (!match) return null
			return {
				ddd: match[1],
				numero: match[2],
			}
		}

		const telefonesFormatados = formData.telefones
			.map(parseTelefone)
			.filter((t) => t !== null) as { ddd: string; numero: string }[]

		const documentosFormatados = formData.documentos
			.filter((doc) => doc.numero.trim() !== "")
			.map((doc) => ({
				...(editingCliente && doc.id ? { id: doc.id } : {}),
				tipo: doc.tipo,
				numero: doc.numero,
				dataEmissao: doc.dataEmissao,
			}))

		const dependentesFormatados = formData.dependentes
			.filter((dep) => dep.nome.trim() !== "")
			.map((dep) => ({
				...(dep.id ? { id: dep.id } : {}),
				nome: dep.nome,
				nomeSocial: dep.nomeSocial || undefined,
				dataNascimento: dep.dataNascimento,
				tipo: "DEPENDENTE",
				titularId: null,
				dependentes: null,
				endereco: null,
				telefones: null,
				documentos:
					dep.documentos.length > 0
						? dep.documentos
							.filter((doc) => doc.numero.trim() !== "")
							.map((doc) => ({
								...(doc.id ? { id: doc.id } : {}),
								tipo: doc.tipo,
								numero: doc.numero,
								dataEmissao: doc.dataEmissao,
							}))
						: null,
			}))

		const payload = {
			tipo: formData.tipo,
			nome: formData.nome,
			nomeSocial: formData.nomeSocial || undefined,
			dataNascimento: formData.dataNascimento,
			titularId: formData.tipo === "DEPENDENTE" ? formData.titularId || null : null,
			endereco: formData.tipo === "DEPENDENTE" ? undefined : formData.endereco,
			documentos: documentosFormatados.length > 0 ? documentosFormatados : [],
			telefones: telefonesFormatados.length > 0 ? telefonesFormatados : [],
			dependentes: formData.tipo === "TITULAR" && dependentesFormatados.length > 0 ? dependentesFormatados : [],
		}

		try {
			if (editingCliente) {
				await api.put(`/clientes/${editingCliente.id}`, {
					id: editingCliente.id,
					...payload,
					endereco: { ...formData.endereco, id: editingCliente.endereco?.id },
				})
			} else {
				await api.post("/clientes", payload)
			}

			resetForm()
			setIsDialogOpen(false)
			onFetch()
		} catch (err) {
			console.error("Erro ao salvar cliente:", err)
		}
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

	const adicionarDocumento = () => {
		setFormData({
			...formData,
			documentos: [
				...formData.documentos,
				{
					id: "",
					tipo: "RG",
					numero: "",
					dataEmissao: "",
				},
			],
		})
	}

	const removerDocumento = (index: number) => {
		const novosDocumentos = formData.documentos.filter((_, i) => i !== index)
		setFormData({
			...formData,
			documentos:
				novosDocumentos.length > 0
					? novosDocumentos
					: [
						{
							id: "",
							tipo: "RG",
							numero: "",
							dataEmissao: "",
						},
					],
		})
	}

	const atualizarDocumento = (index: number, campo: string, valor: string) => {
		const novosDocumentos = [...formData.documentos]
		novosDocumentos[index] = { ...novosDocumentos[index], [campo]: valor }
		setFormData({
			...formData,
			documentos: novosDocumentos,
		})
	}

	const adicionarDependente = () => {
		setFormData({
			...formData,
			dependentes: [
				...formData.dependentes,
				{
					id: "",
					nome: "",
					nomeSocial: "",
					dataNascimento: "",
					documentos: [
						{
							id: "",
							tipo: "RG",
							numero: "",
							dataEmissao: "",
						},
					],
				},
			],
		})
	}

	const removerDependente = (index: number) => {
		const novosDependentes = formData.dependentes.filter((_, i) => i !== index)
		setFormData({
			...formData,
			dependentes: novosDependentes,
		})
	}

	const atualizarDependente = (index: number, campo: string, valor: string) => {
		const novosDependentes = [...formData.dependentes]
		novosDependentes[index] = { ...novosDependentes[index], [campo]: valor }
		setFormData({
			...formData,
			dependentes: novosDependentes,
		})
	}

	const adicionarDocumentoDependente = (dependenteIndex: number) => {
		const novosDependentes = [...formData.dependentes]
		novosDependentes[dependenteIndex].documentos.push({
			id: "",
			tipo: "RG",
			numero: "",
			dataEmissao: "",
		})
		setFormData({
			...formData,
			dependentes: novosDependentes,
		})
	}

	const removerDocumentoDependente = (dependenteIndex: number, documentoIndex: number) => {
		const novosDependentes = [...formData.dependentes]
		const novosDocumentos = novosDependentes[dependenteIndex].documentos.filter((_, i) => i !== documentoIndex)
		novosDependentes[dependenteIndex].documentos =
			novosDocumentos.length > 0
				? novosDocumentos
				: [
					{
						id: "",
						tipo: "RG",
						numero: "",
						dataEmissao: "",
					},
				]
		setFormData({
			...formData,
			dependentes: novosDependentes,
		})
	}

	const atualizarDocumentoDependente = (
		dependenteIndex: number,
		documentoIndex: number,
		campo: string,
		valor: string,
	) => {
		const novosDependentes = [...formData.dependentes]
		novosDependentes[dependenteIndex].documentos[documentoIndex] = {
			...novosDependentes[dependenteIndex].documentos[documentoIndex],
			[campo]: valor,
		}
		setFormData({
			...formData,
			dependentes: novosDependentes,
		})
	}

	const removerCliente = async (id: string) => {
		try {
			await  api.delete(`/clientes/${id}`)
			onFetch()
		} catch (err) {
			console.error(err)
		}
	}

	const calcularIdade = (dataNascimento: string) => {
		const hoje = new Date()
		const nascimento = new Date(dataNascimento)
		let idade = hoje.getFullYear() - nascimento.getFullYear()
		const mes = hoje.getMonth() - nascimento.getMonth()
		if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
			idade--
		}
		return idade
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
				<div>
					<h2 className="text-xl font-semibold text-white">Lista de Clientes</h2>
					<p className="text-gray-400">Total: {clientes.length} clientes</p>
				</div>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
							<UserPlus className="h-4 w-4 mr-2" />
							Novo Cliente
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-[95vw] sm:max-w-6xl max-h-[90vh] overflow-y-auto mx-auto fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
						<DialogHeader>
							<DialogTitle>{editingCliente ? "Editar Cliente" : "Cadastrar Novo Cliente"}</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
									<Label htmlFor="nomeSocial">Nome Social (Opcional)</Label>
									<Input
										id="nomeSocial"
										value={formData.nomeSocial}
										onChange={(e) => setFormData({ ...formData, nomeSocial: e.target.value })}
										placeholder="Como prefere ser chamado(a)"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="dataNascimento">Data de Nascimento</Label>
									<Input
										id="dataNascimento"
										type="date"
										value={formData.dataNascimento}
										onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="tipo">Tipo de Cliente</Label>
									<Select
										value={formData.tipo}
										onValueChange={(value: "TITULAR" | "DEPENDENTE") => setFormData({ ...formData, tipo: value })}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="TITULAR">TITULAR</SelectItem>
											<SelectItem value="DEPENDENTE">DEPENDENTE</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							{formData.tipo === "DEPENDENTE" && (
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
											placeholder="1212345-6789"
											disabled={formData.tipo === "DEPENDENTE"}
										/>
										{formData.telefones.length > 1 && formData.tipo === "TITULAR" && (
											<Button type="button" variant="outline" size="icon" onClick={() => removerTelefone(index)}>
												<Minus className="h-4 w-4" />
											</Button>
										)}
									</div>
								))}
								{formData.tipo === "DEPENDENTE" && (
									<p className="text-sm text-gray-500">Dependentes herdam os telefones do titular</p>
								)}
							</div>

							<div className="space-y-4">
								<Label className="text-base font-semibold">Endereço</Label>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
											disabled={formData.tipo === "DEPENDENTE"}
											required={formData.tipo === "TITULAR"}
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
											disabled={formData.tipo === "DEPENDENTE"}
											required={formData.tipo === "TITULAR"}
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
											disabled={formData.tipo === "DEPENDENTE"}
											required={formData.tipo === "TITULAR"}
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
											disabled={formData.tipo === "DEPENDENTE"}
											required={formData.tipo === "TITULAR"}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="estado">Estado</Label>
										<Select
											value={formData.endereco.estado}
											onValueChange={(value) =>
												setFormData({
													...formData,
													endereco: { ...formData.endereco, estado: value },
												})
											}
											disabled={formData.tipo === "DEPENDENTE"}
											required={formData.tipo === "TITULAR"}
										>
											<SelectTrigger>
												<SelectValue placeholder="Selecione o estado" />
											</SelectTrigger>
											<SelectContent>
												{estadosBrasil.map((estado) => (
													<SelectItem key={estado.value} value={estado.value}>
														{estado.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
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
											disabled={formData.tipo === "DEPENDENTE"}
											required={formData.tipo === "TITULAR"}
										/>
									</div>
								</div>
								{formData.tipo === "DEPENDENTE" && (
									<p className="text-sm text-gray-500">Dependentes herdam o endereço do titular</p>
								)}
							</div>

							{/* Documentos */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label className="text-base font-semibold">Documentos</Label>
									<Button type="button" variant="outline" size="sm" onClick={adicionarDocumento}>
										<Plus className="h-4 w-4 mr-2" />
										Adicionar Documento
									</Button>
								</div>
								{formData.documentos.map((documento, index) => (
									<Card key={index} className="p-4 bg-white border-gray-300">
										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
											<div className="space-y-2">
												<Label>Tipo de Documento</Label>
												<Select
													value={documento.tipo}
													onValueChange={(value) => atualizarDocumento(index, "tipo", value)}
												>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="RG">RG</SelectItem>
														<SelectItem value="CPF">CPF</SelectItem>
														<SelectItem value="Passaporte">Passaporte</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<div className="space-y-2">
												<Label>Número do Documento</Label>
												<Input
													value={documento.numero}
													onChange={(e) => atualizarDocumento(index, "numero", e.target.value)}
													placeholder="Número do documento"
												/>
											</div>

											<div className="space-y-2">
												<Label>Data de Emissão</Label>
												<Input
													type="date"
													value={documento.dataEmissao}
													onChange={(e) => atualizarDocumento(index, "dataEmissao", e.target.value)}
												/>
											</div>

											{formData.documentos.length > 1 && (
												<div className="flex items-end">
													<Button
														type="button"
														variant="destructive"
														size="icon"
														onClick={() => removerDocumento(index)}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											)}
										</div>
									</Card>
								))}
							</div>

							{formData.tipo === "TITULAR" && (
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<Label className="text-base font-semibold flex items-center gap-2">
											<Users className="h-4 w-4" />
											Dependentes
										</Label>
										<Button type="button" variant="outline" size="sm" onClick={adicionarDependente}>
											<Plus className="h-4 w-4 mr-2" />
											Adicionar Dependente
										</Button>
									</div>
									{formData.dependentes.map((dependente, depIndex) => (
										<Card key={depIndex} className="p-4 bg-blue-50 border-blue-200">
											<div className="space-y-4">
												<div className="flex items-center justify-between">
													<h4 className="font-medium text-blue-900">Dependente {depIndex + 1}</h4>
													<Button
														type="button"
														variant="destructive"
														size="sm"
														onClick={() => removerDependente(depIndex)}
													>
														<Trash2 className="h-4 w-4 mr-2" />
														Remover
													</Button>
												</div>

												<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
													<div className="space-y-2">
														<Label>Nome Completo</Label>
														<Input
															value={dependente.nome}
															onChange={(e) => atualizarDependente(depIndex, "nome", e.target.value)}
															placeholder="Nome do dependente"
														/>
													</div>
													<div className="space-y-2">
														<Label>Nome Social (Opcional)</Label>
														<Input
															value={dependente.nomeSocial}
															onChange={(e) => atualizarDependente(depIndex, "nomeSocial", e.target.value)}
															placeholder="Nome social"
														/>
													</div>
													<div className="space-y-2">
														<Label>Data de Nascimento</Label>
														<Input
															type="date"
															value={dependente.dataNascimento}
															onChange={(e) => atualizarDependente(depIndex, "dataNascimento", e.target.value)}
														/>
													</div>
												</div>

												<div className="space-y-3">
													<div className="flex items-center justify-between">
														<Label className="text-sm font-medium">Documentos do Dependente</Label>
														<Button
															type="button"
															variant="outline"
															size="sm"
															onClick={() => adicionarDocumentoDependente(depIndex)}
														>
															<Plus className="h-3 w-3 mr-1" />
															Documento
														</Button>
													</div>
													{dependente.documentos?.map((documento, docIndex) => (
														<div
															key={docIndex}
															className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 bg-white rounded border"
														>
															<div className="space-y-1">
																<Label className="text-xs">Tipo</Label>
																<Select
																	value={documento.tipo}
																	onValueChange={(value) =>
																		atualizarDocumentoDependente(depIndex, docIndex, "tipo", value)
																	}
																>
																	<SelectTrigger className="h-8">
																		<SelectValue />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value="RG">RG</SelectItem>
																		<SelectItem value="CPF">CPF</SelectItem>
																		<SelectItem value="Passaporte">Passaporte</SelectItem>
																	</SelectContent>
																</Select>
															</div>

															<div className="space-y-1">
																<Label className="text-xs">Número</Label>
																<Input
																	className="h-8"
																	value={documento.numero}
																	onChange={(e) =>
																		atualizarDocumentoDependente(depIndex, docIndex, "numero", e.target.value)
																	}
																	placeholder="Número"
																/>
															</div>

															<div className="space-y-1">
																<Label className="text-xs">Data Emissão</Label>
																<div className="flex gap-1">
																	<Input
																		className="h-8"
																		type="date"
																		value={documento.dataEmissao}
																		onChange={(e) =>
																			atualizarDocumentoDependente(depIndex, docIndex, "dataEmissao", e.target.value)
																		}
																	/>
																	{dependente.documentos.length > 1 && (
																		<Button
																			type="button"
																			variant="destructive"
																			size="icon"
																			className="h-8 w-8"
																			onClick={() => removerDocumentoDependente(depIndex, docIndex)}
																		>
																			<Trash2 className="h-3 w-3" />
																		</Button>
																	)}
																</div>
															</div>
														</div>
													))}
												</div>
											</div>
										</Card>
									))}
								</div>
							)}

							<div className="flex gap-3">
								<Button type="submit" className="flex-1">
									{editingCliente ? "Atualizar Cliente" : "Cadastrar Cliente"}
								</Button>
								<Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
									Cancelar
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
				{clientes.length === 0 ? (
					<Card className="bg-gray-800 border-gray-700">
						<CardContent className="flex flex-col items-center justify-center py-12">
							<div className="text-gray-500 mb-4">
								<UserPlus className="h-12 w-12" />
							</div>
							<h3 className="text-lg font-medium text-white mb-2">Nenhum cliente cadastrado</h3>
							<p className="text-gray-400 text-center mb-4">
								Comece cadastrando seu primeiro cliente para gerenciar hospedagens.
							</p>
							<Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
								<UserPlus className="h-4 w-4 mr-2" />
								Cadastrar Primeiro Cliente
							</Button>
						</CardContent>
					</Card>
				) : (
					clientes.map((cliente) => (
						<Card key={cliente.id} className="bg-gray-800 border-gray-700 hover:shadow-md transition-shadow">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<div>
									<CardTitle className="text-lg text-white">{cliente.nome}</CardTitle>
									{cliente.nomeSocial && (
										<p className="text-sm text-gray-400 mt-1">Nome social: {cliente.nomeSocial}</p>
									)}
									<div className="flex gap-2 mt-2 flex-wrap">
										<Badge variant={cliente.tipo === "TITULAR" ? "default" : "secondary"}>
											{cliente.tipo?.toUpperCase()}
										</Badge>
										<Badge variant="outline" className="flex items-center gap-1 text-white border-gray-600">
											<Calendar className="h-3 w-3" />
											{calcularIdade(cliente.dataNascimento)} anos
										</Badge>
										{cliente.tipo === "DEPENDENTE" && cliente.titularId && (
											<Badge variant="outline" className="text-white border-gray-600">
												Titular: {clientes.find((c) => c.id === cliente.titularId)?.nome}
											</Badge>
										)}
										{cliente.dependentes && cliente.dependentes.length > 0 && (
											<Badge variant="outline" className="text-white border-gray-600 flex items-center gap-1">
												<Users className="h-3 w-3" />
												{cliente.dependentes.length} dependente{cliente.dependentes.length > 1 ? "s" : ""}
											</Badge>
										)}
									</div>
								</div>
								<div className="flex gap-2">
									<Button variant="outline" size="icon" onClick={() => handleEdit(cliente)}>
										<Edit className="h-4 w-4" />
									</Button>
									<Button variant="destructive" size="icon" onClick={() => removerCliente(cliente.id)}>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-3 text-sm">
									<div>
										<strong className="text-gray-300">Data de Nascimento:</strong>
										<div className="ml-2 text-gray-400">
											{new Date(cliente.dataNascimento).toLocaleDateString("pt-BR")}
										</div>
									</div>

									<div>
										<strong className="text-gray-300">Telefones:</strong>
										<div className="ml-2 text-gray-400">
											{cliente.telefones?.map((tel) => (
												<div key={tel.id}>({tel.ddd}) {tel.numero}</div>
											))}
										</div>
									</div>

									<div>
										<strong className="text-gray-300">Endereço:</strong>
										<div className="ml-2 text-gray-400">
											{cliente.endereco?.rua}, {cliente.endereco?.numero}
											<br />
											{cliente.endereco?.bairro} - {cliente.endereco?.cidade}/{cliente.endereco?.estado}
											<br />
											CEP: {cliente.endereco?.cep}
										</div>
									</div>

									<div>
										<strong className="text-gray-300 flex items-center gap-1">
											<FileText className="h-3 w-3" />
											Documentos:
										</strong>
										<div className="ml-2 text-gray-400 space-y-1">
											{cliente.documentos?.map((doc, idx) => (
												<div key={idx} className="flex justify-between items-center">
													<span>
														{doc.tipo}: {doc.numero}
													</span>
													<span className="text-xs text-gray-500">
														{new Date(doc.dataEmissao).toLocaleDateString("pt-BR")}
													</span>
												</div>
											))}
										</div>
									</div>

									{cliente.dependentes && cliente.dependentes.length > 0 && (
										<div>
											<strong className="text-gray-300 flex items-center gap-1">
												<Users className="h-3 w-3" />
												Dependentes:
											</strong>
											<div className="ml-2 text-gray-400 space-y-2">
												{cliente.dependentes.map((dep, idx) => (
													<div key={idx} className="p-2 bg-gray-700 rounded text-xs">
														<div className="font-medium text-gray-200">
															{dep.nome} {dep.nomeSocial && `(${dep.nomeSocial})`}
														</div>
														<div className="text-gray-400">
															{calcularIdade(dep.dataNascimento)} anos -{" "}
															{dep.documentos?.length ?? 0} documento
															{dep.documentos && dep.documentos.length > 1 ? "s" : ""}
														</div>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>
		</div>
	)
}
