"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Waves, Star, Shield, Zap } from "lucide-react"
import { Customer, Accomadation, Hospedagem } from "@/app/page"

type DashboardProps = {
  clientes: Customer[]
  acomodacoes: Accomadation[]
  hospedagens: Hospedagem[]
}

export default function Dashboard({ clientes, acomodacoes, hospedagens }: DashboardProps) {
	const features = [
		{
			icon: Waves,
			title: "Gestão Fluida",
			description: "Como as águas do oceano, nosso sistema flui naturalmente",
		},
		{
			icon: Shield,
			title: "Segurança Total",
			description: "Proteção robusta para seus dados e operações",
		},
		{
			icon: Star,
			title: "Experiência Premium",
			description: "Interface elegante e funcionalidades avançadas",
		},
		{
			icon: Zap,
			title: "Performance Rápida",
			description: "Velocidade e eficiência em cada operação",
		},
	]

	return (
		<div className="min-h-full flex items-center justify-center p-3 sm:p-6">
			<div className="max-w-4xl w-full space-y-6 sm:space-y-8">
				<div className="text-center space-y-4">
					<div className="flex justify-center mb-4 sm:mb-6">
						<div className="relative">
							<div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center shadow-2xl">
								<Waves className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
							</div>
							<div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full blur opacity-30"></div>
						</div>
					</div>

					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
						Bem-vindo ao Atlantis
					</h1>

					<p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
						O sistema de gestão hoteleira mais avançado e elegante. Mergulhe em uma experiência única de gerenciamento.
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-12">
					{features.map((feature, index) => {
						const Icon = feature.icon
						return (
							<Card
								key={index}
								className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
							>
								<CardHeader className="pb-3">
									<div className="flex items-center gap-3">
										<div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg">
											<Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
										</div>
										<CardTitle className="text-white text-base sm:text-lg">{feature.title}</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
								</CardContent>
							</Card>
						)
					})}
				</div>

				<Card className="bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600 mt-8 sm:mt-12">
					<CardContent className="p-6 sm:p-8">
						<div className="text-center space-y-4">
							<h2 className="text-xl sm:text-2xl font-semibold text-white">Pronto para começar?</h2>
							<p className="text-gray-400 text-sm sm:text-base">
								Use o menu lateral para navegar entre as funcionalidades do sistema
							</p>
							<div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-6">
								<div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-700 rounded-full">
									<div className="w-2 h-2 bg-blue-400 rounded-full"></div>
									<span className="text-xs sm:text-sm text-gray-300">Clientes</span>
								</div>
								<div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-700 rounded-full">
									<div className="w-2 h-2 bg-green-400 rounded-full"></div>
									<span className="text-xs sm:text-sm text-gray-300">Acomodações</span>
								</div>
								<div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-700 rounded-full">
									<div className="w-2 h-2 bg-orange-400 rounded-full"></div>
									<span className="text-xs sm:text-sm text-gray-300">Hospedagens</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="text-center pt-6 sm:pt-8">
					<p className="text-gray-500 text-xs sm:text-sm">
						Sistema Atlantis - Onde a tecnologia encontra a hospitalidade
					</p>
				</div>
			</div>
		</div>
	)
}
