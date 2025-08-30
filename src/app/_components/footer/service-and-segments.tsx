type ServiceAndSegmentsProps = {
  title: string
  servicesOrSegments: string[]
}

export function ServiceAndSegments({ title, servicesOrSegments }: ServiceAndSegmentsProps) {
  return (
    <div>
      <h4 className="mb-4 font-semibold text-lg">{title}</h4>
      <ul className="space-y-2 text-gray-400">
        {servicesOrSegments.map((serviceOrSegment, index) => (
          <li key={index}>{serviceOrSegment}</li>
        ))}
      </ul>
    </div>
  )
}
