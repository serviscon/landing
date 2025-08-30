type StatItemProps = {
  label: string
  value: string
}

export function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="text-center">
      <div className="mb-2 font-bold text-3xl text-white">{label}</div>
      <div className="text-sky-100">{value}</div>
    </div>
  )
}
