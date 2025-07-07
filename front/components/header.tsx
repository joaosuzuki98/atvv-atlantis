"use client"

import { Badge } from "@/components/ui/badge"

interface HeaderProps {
	activeTab: string
}

const tabTitles = {
	dashboard: "Dashboard",
	clientes: "Clientes",
	acomodacoes: "Acomodações",
	hospedagens: "Hospedagens",
}

const tabDescriptions = {
	dashboard: "Visão geral do sistema",
	clientes: "Gerencie clientes titulares e dependentes",
	acomodacoes: "Gerencie pacotes de acomodação",
	hospedagens: "Registre e acompanhe hospedagens",
}

export default function Header({ activeTab }: HeaderProps) {
	return (
		<header className="bg-gray-800 border-b border-gray-700 px-3 sm:px-6 py-3 sm:py-4">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
				<div>
					<h1 className="text-xl sm:text-2xl font-bold text-white">{tabTitles[activeTab as keyof typeof tabTitles]}</h1>
					<p className="text-gray-400 mt-1 text-sm sm:text-base hidden sm:block">
						{tabDescriptions[activeTab as keyof typeof tabDescriptions]}
					</p>
				</div>
				<Badge variant="outline" className="bg-green-900 text-green-300 border-green-700 w-fit">
					Sistema Online
				</Badge>
			</div>
		</header>
	)
}
