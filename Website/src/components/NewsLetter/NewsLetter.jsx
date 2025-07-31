import { Button } from "@/components/ui/button"

const Newsletter =()=> {
  return (
    <section className="bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
        <p className="text-xl mb-8">Stay updated with our latest offers and products</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 rounded-md text-white w-full sm:w-64"
          />
          <Button variant="secondary" size="lg">Subscribe</Button>
        </div>
      </div>
    </section>
  )
}
export default Newsletter
