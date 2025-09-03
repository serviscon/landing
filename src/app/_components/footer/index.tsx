import Image from 'next/image'
import { FaFacebookSquare, FaWhatsapp } from 'react-icons/fa'
import { GrLinkedin } from 'react-icons/gr'
import { SiInstagram } from 'react-icons/si'
import { ServiceAndSegments } from './service-and-segments'
import { SocialIconTooltip } from './social-icon-tooltip'

export function Footer() {
  return (
    <footer className="bg-sky-950 py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="col-span-2">
            <div className="mb-4 flex items-center space-x-2">
              <Image src="/serviscon-logo.png" alt="Logo" width={170} height={150} priority quality={100} />
            </div>
            <p className="mb-4 max-w-lg text-muted/80">
              Mais de 10 anos transformando empresas através da terceirização inteligente. Somos a solução que seu negócio precisa
              para crescer com eficiência e qualidade.
            </p>

            <div className="flex space-x-4">
              <SocialIconTooltip link="https://www.facebook.com/servisconterceirizacao" label="Facebook">
                <FaFacebookSquare />
              </SocialIconTooltip>
              <SocialIconTooltip link="https://www.instagram.com/servisconterceirizacao?igsh=ZGdvaDA5ZW5oNXR2" label="Instagram">
                <SiInstagram />
              </SocialIconTooltip>
              <SocialIconTooltip link="https://www.linkedin.com/company/serviscon-eireli/" label="LinkedIn">
                <GrLinkedin />
              </SocialIconTooltip>
              <SocialIconTooltip
                link="https://wa.me/5598986133076?text=%F0%9F%91%8B%20Ol%C3%A1!%20Gostaria%20de%20conhecer%20melhor%20os%20servi%C3%A7os%20da%20Serviscon."
                label="Whatsapp"
              >
                <FaWhatsapp />
              </SocialIconTooltip>
            </div>
          </div>

          <ServiceAndSegments
            title="Nossos Serviços"
            servicesOrSegments={[
              'Limpeza e Conservação',
              'Portaria',
              'Recepção',
              'Jardinagem e Paisagismo',
              'Supervisão',
              'Manutenção Predial',
            ]}
          />

          <ServiceAndSegments
            title="Nossos Segmentos"
            servicesOrSegments={['Shoppings e Varejo', 'Educação', 'Condomínios', 'Órgãos Públicos', 'Saúde', 'Industrial']}
          />
        </div>

        <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        <div className="border-gray-800 border-t pt-8 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} Serviscon. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
