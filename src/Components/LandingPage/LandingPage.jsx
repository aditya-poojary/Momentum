import React from 'react';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen bg-[#152d40]">
      {/* Header is integrated via router, so removing header here */}

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Professional Analytics Dashboard
              </h1>
              <p className="text-xl text-gray-300">
                Monitor your business metrics in real-time with our intuitive dashboard interface.
              </p>
              <button className="bg-[#152d70] hover:bg-[#1a3580] text-white px-8 py-3 rounded-lg transition-colors">
                Get Started
              </button>
            </div>

            {/* Right Column - Dashboard Image */}
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl">
              <img 
                src="LandingPageImage.png"
                alt="Analytics Dashboard"
                className="w-full h-full object-cover"
              />
              {/* Overlay Gradient matching the theme */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#152d46]/20 to-[#152d70]/20" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-[#152d40] py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature Cards */}
              {[
                {
                  title: 'Real-time Analytics',
                  description: 'Monitor your metrics in real-time with automatic updates.'
                },
                {
                  title: 'Custom Dashboards',
                  description: 'Create personalized views tailored to your needs.'
                },
                {
                  title: 'Advanced Reporting',
                  description: 'Generate detailed reports with just a few clicks.'
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-[#152d60] p-6 rounded-lg hover:bg-[#1a3580] transition-colors"
                >
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer is integrated via router, so removing footer here */}
    </div>
  );
};

export default LandingPage;