import { AuroraText } from '@/components/magicui/aurora-text'
import { Badge } from '@/components/ui/badge'
import { TypesServices } from './types-services'

export function Services() {
  return (
    <section id="services" className="border-gray-200 border-y bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="mb-16 animate-fade-in text-center">
          <Badge className="mb-4 bg-sky-100 text-sky-800 hover:bg-sky-100">⚡ Nossos Serviços</Badge>

          <h2 className="mb-6 font-bold text-4xl text-gray-800 lg:text-5xl">
            Soluções <span className="bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">Completas</span>{' '}
            para seu Negócio
          </h2>
          <p className="mx-auto max-w-3xl text-gray-600 text-lg md:text-xl">
            Oferecemos uma gama completa de serviços especializados com{' '}
            <AuroraText>gestão total, equipe qualificada e tecnologia de ponta</AuroraText>
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <TypesServices />
        </div>
      </div>
    </section>
  )
}
