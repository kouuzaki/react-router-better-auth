interface LoginHeaderProps {
    icon?: React.ReactNode;
    title: string;
    subtitle?: string;
}

export function LoginHeader({ icon, title, subtitle }: LoginHeaderProps) {
    return (
        <div className="flex flex-col items-center text-center">
            {icon && <div className="mb-4">{icon}</div>}
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            {subtitle && (
                <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            )}
        </div>
    );
}
