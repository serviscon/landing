import { Badge } from '@/components/ui/badge'
import { Companies } from './companies'

export function Partners() {
  return (
    <section id="partners" className="border-gray-200 border-y bg-white py-12">
      <div className="container mx-auto px-4 text-center">
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">🤝 Empresas Parceiras</Badge>
        <div className="mt-4 mb-8 text-center">
          <h3 className="mb-4 font-semibold text-lg text-muted-foreground md:text-2xl">Empresas que confiam na Serviscon</h3>
        </div>

        <div className="relative overflow-hidden">
          <Companies />
        </div>
      </div>
    </section>
  )
}
