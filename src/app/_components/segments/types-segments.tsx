import { Factory, GraduationCap, Heart, Home, Landmark, ShoppingCart } from 'lucide-react'
import { MagicCard } from '@/components/magicui/magic-card'

const segments = [
  {
    icon: <ShoppingCart className="size-12" />,
    title: 'Shoppings e Varejo',
    description: 'Soluções especializadas para centros comerciais e lojas',
  },
  {
    icon: <GraduationCap className="size-12" />,
    title: 'Educação',
    description: 'Serviços para escolas, universidades e instituições de ensino',
  },
  {
    icon: <Home className="size-12" />,
    title: 'Condomínios',
    description: 'Gestão completa de serviços para condomínios residenciais e comerciais',
  },
  {
    icon: <Landmark className="size-12" />,
    title: 'Órgãos Públicos',
    description: 'Atendimento especializado para instituições governamentais',
  },
  {
    icon: <Heart className="size-12" />,
    title: 'Saúde',
    description: 'Serviços especializados para hospitais, clínicas e laboratórios',
  },
  {
    icon: <Factory className="size-12" />,
    title: 'Industrial',
    description: 'Soluções robustas para o setor industrial e manufatureiro',
  },
]

export function TypesSegments() {
  return (
    <>
      {segments.map((segment, index) => (
        <MagicCard
          key={index}
          className="group flex h-full w-full flex-col items-center justify-center rounded-lg border-0 bg-gradient-to-br from-white to-gray-50 p-8 text-center transition-all duration-300"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-200 to-blue-100 transition-transform duration-300 group-hover:scale-110">
            <div className="text-blue-600 transition-colors duration-300 group-hover:text-blue-800">{segment.icon}</div>
          </div>
          <h3 className="mb-4 font-bold text-gray-800 text-xl">{segment.title}</h3>
          <p className="text-gray-600 leading-relaxed">{segment.description}</p>
        </MagicCard>
      ))}
    </>
  )
}
