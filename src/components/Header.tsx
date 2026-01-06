"use client"
import Logo from "@/components/images/logo.png";
import { ProtectedLink } from "@/components/ProtectedLink";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
const CATEGORIES = [
    { title: 'Technology', value: 'tech' },
    { title: 'Lifestyle', value: 'lifestyle' },
    { title: 'Education', value: 'education' },
    { title: 'News', value: 'news' },
    { title: 'Entertainment', value: 'entertainment' },

];


function Header() {
    return (
        <header className="flex items-center justify-between py-4 px-4 lg:px-20 max-w-7xl mx-auto">
            <div className="flex items-center gap-1">
                <Image src={Logo} alt="Logo" className="w-[30px]" />
                <Link href="/" className="text-sm md:text-base font-semibold">Blogify</Link>
            </div>



            <nav className="md:flex items-center hidden">
                <NavigationMenu viewport={false}>
                    <NavigationMenuList className="gap-2">
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link
                                    href="/"
                                    className={cn(
                                        navigationMenuTriggerStyle(),
                                        "flex items-center bg-transparent border-0 outline-none relative"
                                    )}
                                >
                                    <span>Home</span>
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="flex items-center gap-2 border-0 outline-none bg-transparent">
                                <span>Categories</span>
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className="z-50">
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                    {CATEGORIES.map((category) => (
                                        <li key={category.value}>
                                            <NavigationMenuLink asChild>
                                                <ProtectedLink
                                                    href={`/posts?categories=${category.value}`}
                                                    className="block bg-transparent border-0 outline-none select-none space-y-1 rounded-md p-3 leading-none no-underline transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                >
                                                    <div className="text-sm font-semibold leading-none">{category.title}</div>
                                                    <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
                                                        Explore latest stories in {category.title}
                                                    </p>
                                                </ProtectedLink>
                                            </NavigationMenuLink>
                                        </li>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="flex items-center gap-2 border-0 outline-none bg-transparent">
                                <span>Posts</span>
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className="z-50">
                                <ul className="grid w-[240px] gap-2 p-3">
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <ProtectedLink
                                                href="/create-post"
                                                className="flex items-center gap-3 select-none space-y-1 rounded-md p-3 leading-none no-underline border-0 outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                            >
                                                <div className="bg-indigo-50 p-2 rounded-lg group-hover:bg-white transition-colors">
                                                    <Sparkles className="w-4 h-4 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold leading-none">Create Post</div>
                                                    <p className="text-[11px] text-muted-foreground mt-1">Generate with AI magic</p>
                                                </div>
                                            </ProtectedLink>
                                        </NavigationMenuLink>
                                    </li>
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <ProtectedLink
                                                href="/my-posts"
                                                className="flex items-center gap-3 select-none space-y-1 rounded-md p-3 leading-none no-underline border-0 outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                            >
                                                <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-white transition-colors">
                                                    <LayoutDashboard className="w-4 h-4 text-gray-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold leading-none">View All My Posts</div>
                                                    <p className="text-[11px] text-muted-foreground mt-1">Manage your stories</p>
                                                </div>
                                            </ProtectedLink>
                                        </NavigationMenuLink>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

            </nav>
            <div className="flex items-center">
                <SignedOut>
                    <SignInButton mode="modal">
                        <button className="text-[15px] bg-black px-6 py-1.5 rounded-full font-medium text-white hover:bg-gray-800 transition-colors cursor-pointer ease-in-out">
                            Sign In
                        </button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </header>
    )
}

export default Header