import { CheckCircle, Eye, Leaf, Shield, Sparkles, UserCheck, Wrench } from 'lucide-react'
import Image from 'next/image'
import { FaWhatsapp } from 'react-icons/fa'
import { ShimmerButton } from '@/components/app/shimmer-button'
import { Card, CardContent } from '@/components/ui/card'

const services = [
  {
    icon: <Sparkles className="size-8" />,
    title: 'Limpeza e Conservação',
    description:
      'Serviços completos de limpeza e manutenção da conservação de ambientes com produtos profissionais e equipe especializada',
    image: '/services/limpeza.jpeg',
    features: [
      'Profissionais treinados em técnicas de asseio',
      'Produtos de alta performance',
      'Equipamentos modernos para grandes ambientes',
      'Procedimentos sustentáveis e eficientes',
      'Supervisão constante para garantir excelência',
    ],
  },
  {
    icon: <Shield className="size-8" />,
    title: 'Portaria e Segurança',
    description: 'Controle de acesso e segurança patrimonial com profissionais qualificados e sistemas modernos',
    image: '/services/portaria.jpg',
    features: [
      'Primeira impressão positiva para moradores e clientes',
      'Profissionais preparados para diversas situações',
      'Perfil adequado e alinhado à função',
      'Condições de trabalho que garantem eficiência',
      'Serviço de portaria completo e de confiança',
    ],
  },
  {
    icon: <UserCheck className="size-8" />,
    title: 'Recepção Profissional',
    description: 'Atendimento profissional e acolhedor para seus visitantes e clientes com excelência no atendimento',
    image: '/services/recepcao.jpg',
    features: [
      'Primeira impressão positiva e acolhedora',
      'Atendimento que eleva a satisfação do cliente',
      'Transmissão dos valores da empresa',
      'Experiência planejada do início ao fim',
    ],
  },
  {
    icon: <Leaf className="size-8" />,
    title: 'Jardinagem e Paisagismo',
    description: 'Cuidado e manutenção de áreas verdes e projetos paisagísticos para ambientes sempre belos',
    image: '/services/jardinagem.jpg',
    features: [
      'Cuidado e dedicação para ambientes',
      'Podas e manutenção adequadas às plantas',
      'Limpeza de canteiros e remoção de invasoras',
      'Controle de pragas e doenças',
      'Irrigação correta para cada espécie',
    ],
  },
  {
    icon: <Eye className="size-8" />,
    title: 'Supervisão Especializada',
    description: 'Acompanhamento e gestão da qualidade dos serviços prestados com relatórios e métricas',
    image: '/services/supervisao.jpg',
    features: [
      'Monitoramento constante dos procedimentos',
      'Detecção rápida de falhas e soluções imediatas',
      'Garantia do cumprimento de normas e leis',
      'Gestão de primeiro nível que apoia líderes e gestores',
    ],
  },
  {
    icon: <Wrench className="size-8" />,
    title: 'Manutenção Predial',
    description: 'Serviços de manutenção preventiva e corretiva de instalações com equipe técnica especializada',
    image: '/services/manutencao.jpg',
    features: [
      'Preserva o valor do patrimônio',
      'Reduz custos com reparos futuros',
      'Garante segurança e evita acidentes',
      'Melhora a qualidade de vida no ambiente',
      'Conformidade com normas e leis regulatórias',
    ],
  },
]

export function TypesServices() {
  return (
    <>
      {services.map((service, index) => (
        <Card
          key={index}
          className="group hover:-translate-y-2 flex flex-col overflow-hidden border-0 bg-white p-0 transition-all duration-300 hover:shadow-2xl"
        >
          <div className="relative h-48 overflow-hidden">
            <Image
              src={service.image as string}
              alt={service.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="absolute top-4 right-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm">
              <div className="text-blue-600 transition-colors duration-300 group-hover:text-green-600">{service.icon}</div>
            </div>
          </div>

          <CardContent className="flex flex-1 flex-col p-6">
            <div className="flex-1 space-y-3">
              <h3 className="font-bold text-gray-800 text-xl">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>

              <div className="space-y-2">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 border-gray-100 border-t pt-4">
              <ShimmerButton
                service={`Tenho interesse em conhecer mais sobre o serviço de ${service.title} e solicitar um orçamento.`}
                icon={<FaWhatsapp />}
              >
                Solicitar Orçamento
              </ShimmerButton>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
