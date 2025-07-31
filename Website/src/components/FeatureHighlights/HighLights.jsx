import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, RefreshCw, Shield, HeadphonesIcon } from 'lucide-react'

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free shipping on all orders over PKR 2400",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day return policy for all items",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Your payments are safe with our secure payment system",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Round-the-clock customer support for all your needs",
  },
]

const HighLights = () => {
  return (
    <section className="container py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <feature.icon className="w-10 h-10 mb-4 text-primary" />
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
export default HighLights