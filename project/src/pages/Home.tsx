import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, Star, Users, Calendar, Award, ArrowRight, Play, Heart, Leaf, BookOpen, Scale, Shield, Activity } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Heart,
      title: 'Social Responsibility',
      description: 'Community service and social impact initiatives for underprivileged communities.',
    },
    {
      icon: Shield,
      title: 'Awareness Programs',
      description: 'Good Touch & Bad Touch sessions and emotional well-being workshops.',
    },
    {
      icon: BookOpen,
      title: 'Educational Support',
      description: 'Distribution of books, stationery, and motivational storytelling sessions.',
    },
    {
      icon: Users,
      title: 'Community Outreach',
      description: 'Visits to orphanages, tribal schools, and care centers for direct impact.',
    },
    {
      icon: Activity,
      title: 'Student Leadership',
      description: 'Empowering students to lead initiatives and develop social responsibility.',
    },
    {
      icon: Star,
      title: 'Festival of Hope',
      description: 'Celebrating festivals with those who often feel left out of society.',
    },
  ];

  const stats = [
    { number: '1000+', label: 'Lives Impacted' },
    { number: '100+', label: 'Student Volunteers' },
    { number: '50+', label: 'Programs Organized' },
    { number: '5+', label: 'Years of Service' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="project/public/WhatsApp Image 2025-06-29 at 11.48.33_c311161d.jpg"
            alt="Community Impact"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/70 to-pink-900/80"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8 text-white"
            >
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  Chaitanya
                  <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    Spandana
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed">
                  A student-led social responsibility club inspiring positive change through compassion, awareness, and action for underprivileged communities.
                </p>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                  <p className="text-lg font-medium italic text-yellow-200">
                    "We believe real education lies in feeling others' pain and doing something about it."
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>Join Our Mission</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/events"
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Play className="h-5 w-5" />
                  <span>Explore Programs</span>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="w-full h-96 bg-white/10 rounded-3xl backdrop-blur-sm flex items-center justify-center border border-white/20">
                <div className="text-center space-y-6 text-white">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
                    <Heart className="h-12 w-12 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Voice of Compassion</h3>
                    <p className="text-blue-100">Empowering communities through student leadership</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">1000+</div>
                      <div className="text-xs text-blue-200">Lives Touched</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">100+</div>
                      <div className="text-xs text-blue-200">Volunteers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">50+</div>
                      <div className="text-xs text-blue-200">Programs</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">6</div>
                      <div className="text-xs text-blue-200">Departments</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Voice of Hyderabad Logo Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-12">
              <div className="flex-shrink-0">
                <img
                  src="/Screenshot 2025-06-29 113644.png"
                  alt="Voice of Hyderabad VOH Logo"
                  className="h-32 w-32 lg:h-40 lg:w-40 object-contain mx-auto"
                />
              </div>
              <div className="text-center lg:text-left space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold">
                  Voice of Hyderabad
                </h2>
                <p className="text-xl lg:text-2xl text-red-100">
                  VOH - Let the voices speak!
                </p>
                <p className="text-lg text-red-100 max-w-2xl">
                  Celebrating 25 years of empowering voices and building communities through the power of expression, talent, and social responsibility.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to="/events"
                    className="bg-white text-red-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center justify-center space-x-2"
                  >
                    <Mic className="h-5 w-5" />
                    <span>Explore Voice Events</span>
                  </Link>
                  <Link
                    to="/register"
                    className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-red-600 transition-all duration-200 inline-flex items-center justify-center space-x-2"
                  >
                    <Star className="h-5 w-5" />
                    <span>Join VOH</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Core Activities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We work across multiple domains to create meaningful impact through student-led initiatives focused on social responsibility and community empowerment.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold text-gray-900">A Movement of Young Minds</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Chaitanya Spandana is more than just a club—it's a movement of young minds giving back with heart, courage, and purpose. We focus on uplifting underprivileged communities, especially children from orphanages, tribal areas, and vulnerable backgrounds.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Through awareness sessions, educational support, and community outreach, we encourage students to step beyond academics and actively participate in building a more inclusive and caring society.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Student-Led Impact</h3>
                  <p className="text-gray-600">Empowering students to become changemakers</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative h-96 rounded-3xl overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Student Volunteers"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl">
                    <h3 className="font-bold text-gray-900 mb-1">Changemakers in Action</h3>
                    <p className="text-gray-700 text-sm">Students leading initiatives for social change</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-4xl lg:text-5xl font-bold">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join our student-led movement and become part of something bigger. Together, we can create meaningful change in our communities through compassion and action.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center justify-center space-x-2"
              >
                <span>Join Our Mission</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/about"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200 inline-flex items-center justify-center space-x-2"
              >
                <span>Learn More</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;