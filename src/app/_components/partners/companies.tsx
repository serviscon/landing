import Image from 'next/image'
import { Marquee } from '@/components/magicui/marquee'

export function Companies() {
  const companies = [
    { imagePath: '/partners/logo-alema.png', alt: 'Logo da Empresa Parceira' },
    { imagePath: '/partners/ce.png', alt: 'Logo da Empresa Parceira' },
    { imagePath: '/partners/creche.png', alt: 'Logo da Empresa Parceira' },
    { imagePath: '/partners/cresol.webp', alt: 'Logo da Empresa Parceira' },
    { imagePath: '/partners/dom-bosco.webp', alt: 'Logo da Empresa Parceira' },
    { imagePath: '/partners/duvel.webp', alt: 'Logo da Empresa Parceira' },
    { imagePath: '/partners/ferronorte.png', alt: 'Logo da Empresa Parceira' },
    { imagePath: '/partners/idea.jpg', alt: 'Logo da Empresa Parceira' },
    { imagePath: '/partners/intertek.jpeg', alt: 'Logo da Empresa Parceira' },
    { imagePath: '/partners/mearim-motos.png', alt: 'Logo da Empresa Parceira' },
    { imagePath: '/partners/natura.webp', alt: 'Logo da Empresa Parceira' },
    { imagePath: '/partners/prefeitura.png', alt: 'Logo da Empresa Parceira' },
    { imagePath: '/partners/sescoop.png', alt: 'Logo da Empresa Parceira' },
    { imagePath: '/partners/tropical.jpg', alt: 'Logo da Empresa Parceira' },
    { imagePath: '/partners/undb.webp', alt: 'Logo da Empresa Parceira' },
  ]

  return (
    <Marquee pauseOnHover>
      {companies.map((company, index) => (
        <div key={index} className="mx-4 flex-none">
          <Image
            src={company.imagePath}
            alt={company.alt}
            width={70}
            height={70}
            className="object-contain"
            priority
            quality={100}
          />
        </div>
      ))}
    </Marquee>
  )
}
