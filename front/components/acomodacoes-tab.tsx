"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Trash2, Car, Bed, Snowflake, Home } from "lucide-react"
import type { Acomodacao } from "@/app/page"

interface AcomodacoesTabProps {
	acomodacoes: Acomodacao[]
	setAcomodacoes: (acomodacoes: Acomodacao[]) => void
}

export default function AcomodacoesTab({ acomodacoes, setAcomodacoes }: AcomodacoesTabProps) {
	const [formData, setFormData] = useState({
		nomePacote: "",
		vagasGaragem: 0,
		camasSolteiro: 0,
		camasCasal: 0,
		climatizacao: false,
		numeroSuites: 0,
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		const novaAcomodacao: Acomodacao = {
			id: Date.now().toString(),
			...formData,
		}

		setAcomodacoes([...acomodacoes, novaAcomodacao])

		setFormData({
			nomePacote: "",
			vagasGaragem: 0,
			camasSolteiro: 0,
			camasCasal: 0,
			climatizacao: false,
			numeroSuites: 0,
		})
	}

	const removerAcomodacao = (id: string) => {
		setAcomodacoes(acomodacoes.filter((a) => a.id !== id))
	}

	return (
		<Tabs defaultValue="cadastro" className="space-y-6">
			<TabsList>
				<TabsTrigger value="cadastro">Cadastrar Acomodação</TabsTrigger>
				<TabsTrigger value="lista">Lista de Acomodações</TabsTrigger>
			</TabsList>

			<TabsContent value="cadastro">
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

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

					<Button type="submit" className="w-full">
						Cadastrar Acomodação
					</Button>
				</form>
			</TabsContent>

			<TabsContent value="lista">
				<div className="space-y-4">
					{acomodacoes.length === 0 ? (
						<p className="text-center text-muted-foreground py-8">Nenhuma acomodação cadastrada ainda.</p>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{acomodacoes.map((acomodacao) => (
								<Card key={acomodacao.id}>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-lg">{acomodacao.nomePacote}</CardTitle>
										<Button variant="destructive" size="icon" onClick={() => removerAcomodacao(acomodacao.id)}>
											<Trash2 className="h-4 w-4" />
										</Button>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											<div className="flex items-center gap-2">
												<Car className="h-4 w-4 text-muted-foreground" />
												<span className="text-sm">{acomodacao.vagasGaragem} vagas de garagem</span>
											</div>

											<div className="flex items-center gap-2">
												<Bed className="h-4 w-4 text-muted-foreground" />
												<span className="text-sm">
													{acomodacao.camasSolteiro} solteiro, {acomodacao.camasCasal} casal
												</span>
											</div>

											<div className="flex items-center gap-2">
												<Home className="h-4 w-4 text-muted-foreground" />
												<span className="text-sm">{acomodacao.numeroSuites} suítes</span>
											</div>

											<div className="flex items-center gap-2">
												<Snowflake className="h-4 w-4 text-muted-foreground" />
												<Badge variant={acomodacao.climatizacao ? "default" : "secondary"}>
													{acomodacao.climatizacao ? "Com climatização" : "Sem climatização"}
												</Badge>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</div>
			</TabsContent>
		</Tabs>
	)
}
