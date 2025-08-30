import { Award, Building2, Shield, Users } from 'lucide-react'
import { AuroraText } from '@/components/magicui/aurora-text'
import { cn } from '@/lib/utils'

export function WhyChooseServiscon() {
  const services = [
    {
      icon: <Users className="font-bold" />,
      title: 'Equipe Especializada',
      description: 'Profissionais treinados e capacitados',
      bgAndText: 'bg-sky-100 text-sky-800 hover:bg-sky-100',
    },
    {
      icon: <Shield className="font-bold" />,
      title: 'Segurança Total',
      description: 'Protocolos rigorosos de segurança',
      bgAndText: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
    },
    {
      icon: <Award className="font-bold" />,
      title: 'Excelência',
      description: 'Compromisso com a qualidade',
      bgAndText: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
    },
    {
      icon: <Building2 className="font-bold" />,
      title: 'Gestão Completa',
      description: 'Administração total dos serviços',
      bgAndText: 'bg-rose-100 text-rose-800 hover:bg-rose-100',
    },
  ]

  return (
    <div className="relative animate-fade-in">
      <div className="-translate-x-4 absolute inset-0 rotate-6 rounded-3xl bg-gradient-to-r from-sky-400 to-emerald-400 opacity-20" />

      <div className="relative rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <AuroraText className="text-2xl">Por que escolher a Serviscon?</AuroraText>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div key={index} className="text-center">
              <div className={cn('mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full', service.bgAndText)}>
                {service.icon}
              </div>
              <h3 className="font-semibold text-gray-800">{service.title}</h3>
              <p className="mt-2 text-gray-600 text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
