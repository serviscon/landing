import { Badge } from '@/components/ui/badge'
import { TypesSegments } from './types-segments'

export function Segments() {
  return (
    <section id="segments" className="border-gray-200 border-y py-12">
      <div className="container mx-auto px-4">
        <div className="mb-16 animate-fade-in text-center">
          <Badge className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">🚀 Segmentos Atendidos</Badge>
          <h2 className="mb-6 font-bold text-4xl text-gray-800 lg:text-5xl">
            Atendemos{' '}
            <span className="bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">Diversos Setores</span>
          </h2>
          <p className="mx-auto max-w-3xl text-gray-600 text-xl">
            Nossa experiência abrange múltiplos segmentos, sempre com soluções personalizadas
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <TypesSegments />
        </div>
      </div>
    </section>
  )
}
