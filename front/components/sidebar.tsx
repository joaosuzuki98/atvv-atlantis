"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, Users, Building, Calendar, Hotel, Menu } from "lucide-react"

interface SidebarProps {
	activeTab: string
	setActiveTab: (tab: string) => void
}

const menuItems = [
	{
		id: "dashboard",
		label: "Dashboard",
		icon: LayoutDashboard,
	},
	{
		id: "clientes",
		label: "Clientes",
		icon: Users,
	},
	{
		id: "acomodacoes",
		label: "Acomodações",
		icon: Building,
	},
	{
		id: "hospedagens",
		label: "Hospedagens",
		icon: Calendar,
	},
]

function SidebarContent({ activeTab, setActiveTab, onItemClick }: SidebarProps & { onItemClick?: () => void }) {
	const date = new Date()
	const year = date.getFullYear()
	return (
		<div className="flex flex-col h-full">
			<div className="p-4 sm:p-6 border-b border-gray-700">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-blue-500 rounded-lg">
						<Hotel className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
					</div>
					<div>
						<h1 className="text-lg sm:text-xl font-bold text-white">Atlantis</h1>
						<p className="text-xs sm:text-sm text-gray-400">Sistema Hoteleiro</p>
					</div>
				</div>
			</div>

			<nav className="flex-1 p-3 sm:p-4 space-y-2">
				{menuItems.map((item) => {
					const Icon = item.icon
					return (
						<Button
							key={item.id}
							variant={activeTab === item.id ? "default" : "ghost"}
							className={cn(
								"w-full justify-start gap-3 h-10 sm:h-12 text-sm sm:text-base",
								activeTab === item.id
									? "bg-blue-600 text-white hover:bg-blue-700"
									: "text-gray-300 hover:bg-gray-700 hover:text-white",
							)}
							onClick={() => {
								setActiveTab(item.id)
								onItemClick?.()
							}}
						>
							<Icon className="h-4 w-4 sm:h-5 sm:w-5" />
							<span>{item.label}</span>
						</Button>
					)
				})}
			</nav>

			<div className="p-3 sm:p-4 border-t border-gray-700">
				<div className="text-xs text-gray-400 text-center">© {year} Atlantis v1.0</div>
			</div>
		</div>
	)
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<>
			<div className="lg:hidden">
				<div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-blue-500 rounded-lg">
							<Hotel className="h-5 w-5 text-white" />
						</div>
						<div>
							<h1 className="text-lg font-bold text-white">Atlantis</h1>
						</div>
					</div>
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className="text-white">
								<Menu className="h-6 w-6" />
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="w-64 bg-gray-800 border-gray-700 p-0">
							<SidebarContent activeTab={activeTab} setActiveTab={setActiveTab} onItemClick={() => setIsOpen(false)} />
						</SheetContent>
					</Sheet>
				</div>
			</div>

			<div className="hidden lg:block w-64 bg-gray-800 border-r border-gray-700">
				<SidebarContent activeTab={activeTab} setActiveTab={setActiveTab} />
			</div>
		</>
	)
}
