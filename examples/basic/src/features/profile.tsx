function Avatar() {
  return <img className="size-8 rounded-full" alt="" />;
}

export function Profile() {
  return (
    <section className="flex gap-3 bg-card p-4">
      <Avatar />
      <h2 className={cn("min-w-0 flex-1", active && "text-primary")}>Name</h2>
    </section>
  );
}
