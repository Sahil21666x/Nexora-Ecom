import { PackageCheck, ShoppingBag, ShoppingCart } from "lucide-react"
import { useState, useEffect } from "react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
} from "@/components/ui/sidebar"

const items = [
    {
        title: "Products",
        url: "/",
        icon: ShoppingBag,
    },
    {
        title: "Cart",
        url: "/cart",
        icon: ShoppingCart,
    },
    {
        title: "Checkouts",
        url: "/checkout",
        icon: PackageCheck,
    }
]

export function AppSidebar() {
    const [activeItem, setActiveItem] = useState("/")

    // Update active item based on current URL
    useEffect(() => {
        setActiveItem(window.location.pathname)
    }, [])

    const handleItemClick = (url) => {
        setActiveItem(url)
    }

    return (
        <Sidebar className="border-r bg-background">
            <SidebarHeader className="p-6 border-b">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg">EcomStore</h1>
                        <p className="text-xs text-muted-foreground">Online Store</p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="flex-1 py-4">
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isActive = activeItem === item.url
                                
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton 
                                            asChild 
                                            isActive={isActive}
                                            className="transition-all duration-200 hover:bg-accent/50"
                                        >
                                            <a 
                                                href={item.url} 
                                                className="flex items-center gap-3 px-3 py-3 rounded-lg group"
                                                onClick={() => handleItemClick(item.url)}
                                            >
                                                <item.icon className={`w-5 h-5 transition-colors ${
                                                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                                }`} />
                                                <span className={`font-medium transition-colors ${
                                                    isActive ? "text-primary" : "text-foreground"
                                                }`}>
                                                    {item.title}
                                                </span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}