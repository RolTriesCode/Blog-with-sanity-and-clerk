"use client"
import { cn } from "@/lib/utils";
import { SignInButton, SignedIn, SignedOut, UserButton, UserProfile } from "@clerk/nextjs";
import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sparkles, FileText, Tags, Home, LayoutDashboard } from "lucide-react";

const CATEGORIES = [
    { title: 'Technology', value: 'tech' },
    { title: 'Lifestyle', value: 'lifestyle' },
    { title: 'Education', value: 'education' },
    { title: 'News', value: 'news' },
    { title: 'Entertainment', value: 'entertainment' },

];

const DotIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
        </svg>
    )
}


function Header() {
    return (
        <header className="flex items-center justify-evenly py-4 px-4 lg:px-20 max-w-7xl mx-auto">
            <Link href="/" className="text-[15px] font-semibold">Blogify</Link>


            <nav className="flex items-center">
                <NavigationMenu viewport={false}>
                    <NavigationMenuList className="gap-2">
                        <NavigationMenuItem>
                            <Link href="/" legacyBehavior passHref>
                                <NavigationMenuLink
                                    className={cn(
                                        navigationMenuTriggerStyle(),
                                        "flex items-center bg-transparent border-0 outline-none relative"
                                    )}
                                >
                                    <span>Home</span>
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="flex items-center gap-2 border-0 outline-none bg-transparent">
                                <span>Categories</span>
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className="z-50">
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                    {CATEGORIES.map((category) => (
                                        <li key={category.value}>
                                            <Link href={`/posts?categories=${category.value}`} legacyBehavior passHref>
                                                <NavigationMenuLink className="block bg-transparent border-0 outline-none select-none space-y-1 rounded-md p-3 leading-none no-underline transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                                    <div className="text-sm font-semibold leading-none">{category.title}</div>
                                                    <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
                                                        Explore latest stories in {category.title}
                                                    </p>
                                                </NavigationMenuLink>
                                            </Link>
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
                                        <Link href="/create-post" legacyBehavior passHref>
                                            <NavigationMenuLink className="flex items-center gap-3 select-none space-y-1 rounded-md p-3 leading-none no-underline border-0 outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                                <div className="bg-indigo-50 p-2 rounded-lg group-hover:bg-white transition-colors">
                                                    <Sparkles className="w-4 h-4 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold leading-none">Create Post</div>
                                                    <p className="text-[11px] text-muted-foreground mt-1">Generate with AI magic</p>
                                                </div>
                                            </NavigationMenuLink>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/my-posts" legacyBehavior passHref>
                                            <NavigationMenuLink className="flex items-center gap-3 select-none space-y-1 rounded-md p-3 leading-none no-underline border-0 outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                                <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-white transition-colors">
                                                    <LayoutDashboard className="w-4 h-4 text-gray-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold leading-none">View All My Posts</div>
                                                    <p className="text-[11px] text-muted-foreground mt-1">Manage your stories</p>
                                                </div>
                                            </NavigationMenuLink>
                                        </Link>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

            </nav>
            <div>
                <SignedOut>
                    <SignInButton>
                        <button className="text-[15px] bg-black px-6 py-1.5 rounded-full text-white font-medium">
                            Sign In
                        </button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <div>
                        <UserButton>
                            <UserButton.MenuItems>
                                <UserButton.Link
                                    label="My Posts"
                                    href="/my-posts"
                                    labelIcon={<DotIcon />}
                                />
                            </UserButton.MenuItems>
                        </UserButton>
                    </div>

                </SignedIn>
            </div>
        </header>
    )
}

export default Header