import Image from "next/image";

interface AuthPageHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthPageHeader({ title, subtitle }: AuthPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col items-center gap-2">
      <Image src="/logo.png" alt="Logo" width={80} height={67} className="mb-2" />
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}
