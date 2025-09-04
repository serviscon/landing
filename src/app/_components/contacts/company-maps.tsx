'use client'

import { ExternalLink, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CompanyMapsProps {
  address: string
  companyName?: string
  height?: string
  showDirections?: boolean
}

export default function CompanyMaps({
  address,
  companyName = 'Serviscon',
  height = '400px',
  showDirections = true,
}: CompanyMapsProps) {
  const [mapUrl, setMapUrl] = useState<string>('')
  const [directionsUrl, setDirectionsUrl] = useState<string>('')

  useEffect(() => {
    // Encode the address for URL
    const encodedAddress = encodeURIComponent(address)

    // Google Maps embed URL
    const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'demo'}&q=${encodedAddress}&zoom=15`

    // Google Maps directions URL
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`

    setMapUrl(embedUrl)
    setDirectionsUrl(directionsUrl)
  }, [address])

  const handleGetDirections = () => {
    window.open(directionsUrl, '_blank')
  }

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800 text-xl">
          <MapPin className="size-5" />
          Localização - {companyName}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Map Container */}
        <div className="relative overflow-hidden rounded-lg border">
          <div className="relative overflow-hidden rounded-lg border">
            {mapUrl && (
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                width="100%"
                height={height}
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {showDirections && (
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              onClick={handleGetDirections}
              className="flex items-center gap-2 bg-blue-600 font-bold transition-colors duration-300 hover:bg-blue-700"
            >
              <ExternalLink />
              Como Chegar
            </Button>

            <Button
              onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(address)}`, '_blank')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FcGoogle />
              Ver no Google Maps
            </Button>
          </div>
        )}

        <div className="rounded-lg bg-muted/50 p-4">
          <h4 className="mb-2 font-medium text-blue-800 text-sm">Endereço Completo:</h4>
          <p className="flex flex-col items-center justify-center gap-1 text-muted-foreground text-sm md:flex-row md:flex-wrap md:gap-x-3">
            <span>Prédio Comercial MN Center</span>
            <span>R. dos Ipês, 32 - 2º Andar, Sala 06</span>
            <span>Jardim Renascença</span>
            <span>São Luís - MA</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
