import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Target, Users, Award, Mic, Star, BookOpen, Shield, Lightbulb, Globe } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Compassion',
      description: 'We approach every initiative with empathy and genuine care for those we serve.',
    },
    {
      icon: Target,
      title: 'Purpose-Driven Action',
      description: 'Every activity is designed to create meaningful and lasting positive impact.',
    },
    {
      icon: Users,
      title: 'Community Building',
      description: 'Building bridges between privileged students and underprivileged communities.',
    },
    {
      icon: Award,
      title: 'Student Leadership',
      description: 'Empowering students to lead initiatives and develop social responsibility.',
    },
  ];

  const activities = [
    {
      icon: Shield,
      title: 'Awareness Drives',
      description: 'Good Touch & Bad Touch sessions, menstrual hygiene workshops, and emotional well-being programs for children and girls.',
      color: 'from-red-500 to-pink-600'
    },
    {
      icon: BookOpen,
      title: 'Educational Engagement',
      description: 'Distribution of motivational storybooks, notebooks, stationery kits, and fun-learning sessions.',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Lightbulb,
      title: 'Empowerment Projects',
      description: 'Visits to orphan homes, tribal schools, career guidance, and confidence-building sessions.',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Globe,
      title: 'Festival of Hope',
      description: 'Celebrating festivals with those who feel left out, creating shared spaces of love and cultural connection.',
      color: 'from-purple-500 to-violet-600'
    },
  ];

  const impact = [
    {
      title: 'Safe Expression',
      description: 'Creating safe spaces for children to express themselves freely'
    },
    {
      title: 'Leadership Development',
      description: 'Training student volunteers in leadership, communication, and empathy'
    },
    {
      title: 'Social Responsibility',
      description: 'Instilling a sense of responsibility and gratitude among youth'
    },
    {
      title: 'Mental Health Awareness',
      description: 'Promoting mental health awareness, respect, and emotional bonding'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <h1 className="text-5xl lg:text-6xl font-bold">Chaitanya Spandana Club</h1>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              A Voice of Compassion and Change - Inspiring positive change through compassion, awareness, and action.
            </p>
          </motion.div>
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
              <h2 className="text-4xl font-bold text-gray-900">Our Mission</h2>
              <div className="space-y-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  <strong>Chaitanya Spandana</strong> is a student-led social responsibility club dedicated to inspiring positive change through compassion, awareness, and action. Rooted in the values of empathy and service, we focus on uplifting underprivileged communities, especially children from orphanages, tribal areas, and vulnerable backgrounds.
                </p>
                <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-600">
                  <p className="text-lg text-blue-900 font-medium italic">
                    "We believe real education lies in feeling others' pain and doing something about it."
                  </p>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  It is not just a club—it's a <strong>movement of young minds giving back with heart, courage, and purpose.</strong>
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Empowering Through Action</h3>
                  <p className="text-gray-600">Creating meaningful impact in every community we touch</p>
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
                  src="https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Community Impact"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl">
                    <h3 className="font-bold text-gray-900 mb-1">Student-Led Initiative</h3>
                    <p className="text-gray-700 text-sm">Empowering students to create positive social change</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Goals */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Vision & Goals</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive approach to social responsibility and community development.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To nurture socially responsible citizens by encouraging students to engage in humanitarian activities, build emotional intelligence, and promote inclusiveness across all sections of society.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Mission Goals</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Bridge between privileged students and underprivileged communities</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Empower the voiceless through awareness, education, and empathy</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Create platforms for purposeful initiatives that bring lasting change</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Activities */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Core Activities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive programs designed to create meaningful impact across various domains.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${activity.color} opacity-90`}></div>
                <div className="relative p-8 text-white">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <activity.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{activity.title}</h3>
                  <p className="text-white/90 leading-relaxed">{activity.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why It Matters</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The meaningful impact we create through our dedicated efforts and student participation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impact.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The core principles that guide our approach to social responsibility and community service.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Participation */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <h2 className="text-4xl font-bold">Student Participation</h2>
            <div className="max-w-4xl mx-auto space-y-6 text-lg text-blue-100">
              <p>
                <strong className="text-white">Members are not just volunteers—they are changemakers.</strong> Whether it's through organizing drives, designing creative content, fundraising, or field visits, every student has the chance to lead and learn.
              </p>
              <p>
                Our students develop essential skills in leadership, communication, empathy, and project management while making a real difference in their communities. They learn that true education extends beyond textbooks to include understanding and addressing social challenges.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">100+</div>
                  <div className="text-blue-200">Active Student Volunteers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">50+</div>
                  <div className="text-blue-200">Community Programs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">1000+</div>
                  <div className="text-blue-200">Lives Impacted</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;