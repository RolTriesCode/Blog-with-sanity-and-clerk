"use client"
import { useAuth, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

interface ProtectedLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

export const ProtectedLink = React.forwardRef<HTMLAnchorElement, ProtectedLinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>>(
    ({ href, children, className = "", ...props }, ref) => {
        const { isSignedIn, isLoaded } = useAuth();

        // SSR and initial hydration: Clerk state might not be ready.
        // To avoid mismatch, we can render a placeholder or just the signed-out state by default if we want consistency.
        // However, Clerk handles this. The key is to return a SINGLE element.

        if (!isLoaded) {
            return (
                <div className={`${className} opacity-50`} {...(props as any)} ref={ref as any}>
                    {children}
                </div>
            );
        }

        if (isSignedIn) {
            return (
                <Link href={href} className={className} {...props} ref={ref}>
                    {children}
                </Link>
            );
        }

        return (
            <SignInButton mode="modal" fallbackRedirectUrl={href} forceRedirectUrl={href}>
                <div className={`${className} cursor-pointer`} {...(props as any)} ref={ref as any}>
                    {children}
                </div>
            </SignInButton>
        );
    }
);
