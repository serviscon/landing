import Link from 'next/link'
import { FaWhatsapp } from 'react-icons/fa'
import { ShimmerButton } from '@/components/app/shimmer-button'
import { AuroraText } from '@/components/magicui/aurora-text'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BenefitItems } from './benefit-items'
import { WhyChooseServiscon } from './why-choose-serviscon'

export function Hero() {
  return (
    <section id="home" className="mt-16 mb-12 px-4 pt-20 pb-16 md:mt-0 md:mb-0">
      <div className="container mx-auto">
        <div className="grid min-h-[80vh] items-center gap-12 lg:grid-cols-2">
          <div className="animate-fade-in space-y-8">
            <article className="space-y-4">
              <Badge className="bg-sky-100 text-blue-800 hover:bg-sky-100">✨ Terceirização Premium de Mão de Obra</Badge>
              <h1 className="font-bold text-5xl leading-tight lg:text-6xl">
                <span className="bg-gradient-to-r from-blue-800 to-sky-600 bg-clip-text text-transparent">
                  Transforme seu negócio
                </span>
                <br />
                <span className="text-gray-800">com nossa gestão completa!</span>
              </h1>
              <p className="text-slate-600 text-xl leading-relaxed">
                Especialistas em terceirização de mão de obra com{' '}
                <AuroraText>gestão completa de pessoas, suprimentos e equipamentos</AuroraText>. Qualidade e excelência em cada
                serviço prestado.
              </p>
            </article>

            <div className="flex flex-col gap-4 sm:flex-row">
              <ShimmerButton icon={<FaWhatsapp />}>SOLICITAR ORÇAMENTO GRÁTIS</ShimmerButton>
              <Button variant="outline" size="lg" className="text-blue-700 hover:text-blue-900">
                <Link href="#services" className="flex items-center gap-1.5">
                  👀 CONHECER SERVIÇOS
                </Link>
              </Button>
            </div>

            <div className="flex items-center space-x-8">
              <BenefitItems>Equipe Qualificada</BenefitItems>
              <BenefitItems>Gestão Completa</BenefitItems>
              <BenefitItems>Qualidade e Excelência</BenefitItems>
            </div>
          </div>

          <WhyChooseServiscon />
        </div>
      </div>
    </section>
  )
}
