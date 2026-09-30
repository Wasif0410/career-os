export function PageTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6 sm:mb-8">
      <h1 className="font-display text-[2rem] leading-tight tracking-tight text-ink sm:text-[2.4rem]">{title}</h1>
      {description && <p className="mt-2 max-w-2xl text-slate">{description}</p>}
    </div>
  );
}
