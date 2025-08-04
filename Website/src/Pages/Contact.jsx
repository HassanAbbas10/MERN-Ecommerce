import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, AlertCircle, MessageCircle, Headphones, Shield } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 animate-pulse">
            <MessageCircle className="w-8 h-8" />
          </div>
          <div className="absolute top-32 right-20 animate-bounce">
            <Mail className="w-6 h-6" />
          </div>
          <div className="absolute bottom-20 left-1/4 animate-pulse">
            <Phone className="w-7 h-7" />
          </div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-6">
            <Headphones className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Get In Touch</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Have a question about your order? Need help with a product? Our dedicated customer service team is here to provide you with exceptional support.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information Cards */}
          <div className="lg:col-span-1 space-y-6">
            {/* Phone Card */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:-translate-y-1">
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Phone Support</h3>
                  <p className="text-lg font-semibold text-gray-700 mb-1">+92 3106900479</p>
                  <p className="text-sm text-gray-500">Mon-Fri: 9AM - 6PM EST</p>
                  <p className="text-sm text-green-600 font-medium mt-2">Average response: 2 minutes</p>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:-translate-y-1">
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Email Support</h3>
                  <p className="text-lg font-semibold text-gray-700 mb-1">hassanabbas05674@gmail.com</p>
                  <p className="text-sm text-gray-500">24/7 availability</p>
                  <p className="text-sm text-blue-600 font-medium mt-2">Average response: 4 hours</p>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:-translate-y-1">
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Our Store</h3>
                  <p className="text-gray-700 mb-1">Orion Street 🎃</p>
                  <p className="text-gray-700 mb-2">Garden of Memories, Pak 978065</p>
                  <p className="text-sm text-purple-600 font-medium">Open 7 days a week</p>
                </div>
              </div>
            </div>

            {/* Business Hours Card */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:-translate-y-1">
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Business Hours</h3>
                  <div className="space-y-1 text-gray-700">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: 12:00 PM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Signal */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-bold text-blue-900 mb-1">Secure & Private</h3>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    Your information is protected with enterprise-grade security. We never share your data with third parties.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                <h2 className="text-3xl font-bold text-white mb-2">Send us a Message</h2>
                <p className="text-blue-100">We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.</p>
              </div>
              
              {submitted ? (
                <div className="p-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Send className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Message Sent Successfully!</h3>
                    <p className="text-lg text-gray-600 mb-6">Thank you for reaching out to us. We&apos;ll get back to you within 24 hours.</p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors duration-300 text-lg bg-gray-50 focus:bg-white"
                        placeholder="Your Full Name"
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors duration-300 text-lg bg-gray-50 focus:bg-white"
                        placeholder="Your Email Address"
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors duration-300 text-lg bg-gray-50 focus:bg-white"
                        placeholder="Subject"
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        id="orderNumber"
                        name="orderNumber"
                        value={formData.orderNumber}
                        onChange={handleChange}
                        className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors duration-300 text-lg bg-gray-50 focus:bg-white"
                        placeholder="Order Number (Optional)"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors duration-300 text-lg bg-gray-50 focus:bg-white resize-none"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-lg flex items-center justify-center space-x-3"
                    >
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({
                        name: "",
                        email: "",
                        subject: "",
                        orderNumber: "",
                        message: "",
                      })}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 text-lg"
                    >
                      Clear Form
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Quick Help Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mb-4">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Need Quick Help?</h3>
            <p className="text-gray-600">Check out our frequently asked questions for instant answers</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <h4 className="font-bold text-gray-900 mb-2">Order Status</h4>
              <p className="text-sm text-gray-600">Track your order and get delivery updates</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <h4 className="font-bold text-gray-900 mb-2">Returns & Refunds</h4>
              <p className="text-sm text-gray-600">Learn about our return policy and process</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <h4 className="font-bold text-gray-900 mb-2">Product Support</h4>
              <p className="text-sm text-gray-600">Get help with product questions and issues</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;