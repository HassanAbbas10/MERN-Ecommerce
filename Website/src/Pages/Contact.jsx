import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, AlertCircle } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    orderNumber: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // i will add api call here 🎃
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="bg-orange-500 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-orange-50 max-w-2xl">
            Have a question about your order? Need help with a product? Our customer service team is here to help you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
       
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Phone className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <h3 className="font-medium">Phone Support</h3>
                    <p className="text-gray-600">+92 3106900479</p>
                    <p className="text-sm text-gray-500">Mon-Fri: 9AM - 6PM EST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600">hassanabbas05674@gmail.com</p>
                    <p className="text-sm text-gray-500">24/7 response time</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-gray-600">Orion Street 🎃</p>
                    <p className="text-gray-600">Garden of Memories ,Pak 978065</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <h3 className="font-medium">Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday</p>
                    <p className="text-gray-600">9:00 AM - 6:00 PM EST</p>
                  </div>
                </div>
              </div>

              
              <div className="mt-8 bg-orange-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-orange-900">Need Quick Help?</h3>
                    <p className="text-sm text-orange-700">
                      Check our <a href="#" className="underline">FAQ section</a> for instant answers to common questions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
              
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <h3 className="text-lg font-medium text-green-800 mb-2">Thank you for contacting us!</h3>
                  <p className="text-green-600">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="peer block w-full rounded-lg border border-gray-200 py-3 px-4 text-sm outline-2 placeholder:text-transparent focus:border-orange-500"
                        placeholder="Your name"
                      />
                      <label className="absolute left-2 -top-2 z-[1] px-2 text-xs text-gray-500 transition-all 
                        before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full 
                        before:w-full before:bg-white before:transition-all 
                        peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm 
                        peer-required:after:content-['*'] peer-required:after:text-red-400
                        peer-focus:-top-2 peer-focus:text-xs">
                        Your Name
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="peer block w-full rounded-lg border border-gray-200 py-3 px-4 text-sm outline-2 placeholder:text-transparent focus:border-orange-500"
                        placeholder="Your email"
                      />
                      <label className="absolute left-2 -top-2 z-[1] px-2 text-xs text-gray-500 transition-all 
                        before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full 
                        before:w-full before:bg-white before:transition-all 
                        peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm 
                        peer-required:after:content-['*'] peer-required:after:text-red-400
                        peer-focus:-top-2 peer-focus:text-xs">
                        Email Address
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="peer block w-full rounded-lg border border-gray-200 py-3 px-4 text-sm outline-2 placeholder:text-transparent focus:border-orange-500"
                        placeholder="Subject"
                      />
                      <label className="absolute left-2 -top-2 z-[1] px-2 text-xs text-gray-500 transition-all 
                        before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full 
                        before:w-full before:bg-white before:transition-all 
                        peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm 
                        peer-required:after:content-['*'] peer-required:after:text-red-400
                        peer-focus:-top-2 peer-focus:text-xs">
                        Subject
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        id="orderNumber"
                        name="orderNumber"
                        value={formData.orderNumber}
                        onChange={handleChange}
                        className="peer block w-full rounded-lg border border-gray-200 py-3 px-4 text-sm outline-2 placeholder:text-transparent focus:border-orange-500"
                        placeholder="Order number"
                      />
                      <label className="absolute left-2 -top-2 z-[1] px-2 text-xs text-gray-500 transition-all 
                        before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full 
                        before:w-full before:bg-white before:transition-all 
                        peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm 
                        peer-focus:-top-2 peer-focus:text-xs">
                        Order Number (Optional)
                      </label>
                    </div>
                  </div>

                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="peer block w-full rounded-lg border border-gray-200 py-3 px-4 text-sm outline-2 placeholder:text-transparent focus:border-orange-500"
                      placeholder="Your message"
                    ></textarea>
                    <label className="absolute left-2 -top-2 z-[1] px-2 text-xs text-gray-500 transition-all 
                      before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full 
                      before:w-full before:bg-white before:transition-all 
                      peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm 
                      peer-required:after:content-['*'] peer-required:after:text-red-400
                      peer-focus:-top-2 peer-focus:text-xs">
                      Your Message
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-8 py-3 text-sm font-semibold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;