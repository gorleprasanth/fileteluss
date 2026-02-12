import { motion } from 'framer-motion'

export default function Portfolio() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen bg-primary-dark pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-neon-blue to-blue-400 bg-clip-text text-transparent">
              Portfolio
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            Explore our creator's amazing work and projects
          </p>
        </motion.div>

        {/* Portfolio Iframe */}
        <motion.div
          variants={itemVariants}
          className="glass-card overflow-hidden rounded-3xl"
          style={{
            boxShadow: '0 0 50px rgba(0, 217, 255, 0.1)',
          }}
        >
          <div className="relative w-full h-screen bg-gradient-to-br from-neon-blue/5 to-blue-500/5">
            {/* Animated border */}
            <div className="absolute inset-0 rounded-3xl border border-neon-blue/30 pointer-events-none" style={{
              boxShadow: 'inset 0 0 40px rgba(0, 217, 255, 0.1)',
            }}></div>

            {/* Loading state fallback */}
            <iframe
              src="https://gorleprasanth.github.io/portfolio/"
              title="Portfolio"
              className="w-full h-full border-0 rounded-3xl"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.05) 0%, rgba(0, 153, 204, 0.05) 100%)',
              }}
            ></iframe>

            {/* Overlay message if iframe fails */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm hidden">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Loading Portfolio...</h2>
                <p className="text-gray-300">Please wait while we load the portfolio.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div variants={itemVariants} className="mt-12 glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-4">About This Portfolio</h2>
          <p className="text-gray-300 mb-4">
            This portfolio showcases exceptional design, development, and creativity. Explore the projects, case studies, and achievements that demonstrate professional excellence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {[
              { number: '50+', label: 'Projects Completed' },
              { number: '30+', label: 'Happy Clients' },
              { number: '5+', label: 'Years Experience' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold text-neon-blue mb-2">{stat.number}</p>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
