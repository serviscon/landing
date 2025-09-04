import { Mail, MapPin, Phone } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { ShimmerButton } from '@/components/app/shimmer-button'
import { Badge } from '@/components/ui/badge'
import CompanyMaps from './company-maps'
import { ContactItems } from './contact-items'
import { StatItem } from './stat-item'

export function Contacts() {
  return (
    <section id="contacts" className="bg-gradient-to-br from-blue-800 to-sky-500 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">📲 Nossos Contatos</Badge>
          <h2 className="mt-4 mb-6 font-bold text-4xl text-white lg:text-5xl">
            Pronto para <strong className="backdrop-blur-sm">Reduzir Custos e Aumentar a Eficiência?</strong>
          </h2>
          <p className="mb-8 text-sky-100 text-xl">
            Solicite um orçamento gratuito e descubra como podemos transformar sua operação em até 30 dias
          </p>

          <div className="mb-8 rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <StatItem label="24h" value="Resposta do orçamento" />
              <StatItem label="30 dias" value="Implementação média completa" />
              <StatItem label="30%" value="Economia média" />
            </div>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <ContactItems icon={Phone} title="Telefone" description="(98) 98613-3076" />
            <ContactItems icon={Mail} title="E-mail" description="comercial@serviscon.com.br" />
            <ContactItems icon={MapPin} title="Endereço" description="São Luís, MA" />
          </div>

          <ShimmerButton className="before:mask before:mask-composite-exclude relative font-bold text-blue-700 transition-all duration-300 before:absolute before:inset-0 before:animate-[shimmer_3s_linear_infinite] before:rounded-md before:bg-[length:200%_100%] before:bg-[linear-gradient(120deg,transparent,#FFBF00,transparent)] before:p-[1px] before:content-[''] hover:scale-105 hover:bg-sky-100 hover:text-sky-800 hover:brightness-110 md:mt-0">
            <FaWhatsapp />
            SOLICITAR ORÇAMENTO GRÁTIS
          </ShimmerButton>

          <div className="mt-12 rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
            <h3 className="mb-6 flex items-center justify-center gap-2 font-bold text-2xl text-white">
              <MapPin className="size-5" />
              Nossa Localização
            </h3>
            <div className="rounded-xl bg-white p-4">
              <CompanyMaps
                address="R. dos Ipês, 32 - 2º ANDAR – SALA 06 - Jardim Renascença, São Luís - MA, 65075-200"
                companyName="Serviscon"
                height="350px"
                showDirections={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
