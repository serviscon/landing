type ContactItemsProps = {
  icon: React.ElementType
  title: string
  description: string
}

export function ContactItems({ icon: Icon, title, description }: ContactItemsProps) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-white/20">
        <Icon className="size-8 text-white" />
      </div>
      <h3 className="mb-2 font-semibold text-lg text-white">{title}</h3>
      <p className="text-sky-100">{description}</p>
    </div>
  )
}
