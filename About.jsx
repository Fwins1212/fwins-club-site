export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-slide-up">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <h1 className="text-4xl font-bold text-white">About Fwins Club</h1>
        </div>
        
        <div className="p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6 leading-relaxed text-lg">
              Fwins Club is a new-generation initiative built for students, aspiring entrepreneurs, 
              and future nation-builders who seek the right support to grow and succeed.
            </p>
            
            <p className="text-gray-700 mb-6 leading-relaxed text-lg">
              Born from our own struggles in finding guidance and financial backing, the club stands 
              as a solution-driven community. We aim to empower individuals by connecting them with 
              opportunities, mentorship, and collaborative networks.
            </p>
            
            <div className="bg-blue-50 rounded-xl p-6 my-8">
              <h3 className="text-2xl font-bold text-blue-900 mb-3">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To empower the next generation of leaders by providing access to resources, mentorship, 
                and a supportive community that fosters growth, innovation, and success.
              </p>
            </div>
            
            <p className="text-gray-700 mb-6 leading-relaxed text-lg">
              At Fwins Club, we believe that success is stronger when shared and built together. 
              Our platform encourages innovation, leadership, and mutual growth among like-minded individuals.
            </p>
            
            <div className="bg-blue-50 rounded-xl p-6 my-8">
              <h3 className="text-2xl font-bold text-blue-900 mb-3">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To nurture talent and create impactful change, we are committed to shaping confident 
                leaders of tomorrow who will drive positive change in their communities and beyond.
              </p>
            </div>
            
            <p className="text-gray-700 mb-6 leading-relaxed text-lg">
              With a vision to nurture talent and create impactful change, we are committed to shaping 
              confident leaders of tomorrow.
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600 p-6 mt-8 rounded-r-xl">
              <p className="text-blue-900 font-bold text-xl text-center italic">
                "We for Us… Together We Lead" is not just our motto—it is the foundation of everything we do.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}