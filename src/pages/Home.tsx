import ProgramAI from '@/components/cards/ProgramAI';
import ProgramSection from '@/components/cards/ProgramCard';
import Footer from '@/components/Footer';
// import ProgramSection from '@/cards/programCard';
// import ProgramCard from '@/components/cards/programCard';
import NavBar from '@/components/NavBar';
import Stats from '@/components/Stats';
import Testimony from '@/components/Testimony';
import Welcome from '@/components/Welcome';
import { useTheme } from '@/hooks/useTheme';


const Home = () => {
  const {isDark}= useTheme()
  return (
    <>
      <NavBar />
      <section id="home">
        <Welcome />
      </section>
     <section id="features" className={`h-auto transition-colors ${isDark ? 'bg-primarycolor-800' : 'bg-primarycolor-100'}`}>
        <ProgramSection />
     </section>
     <div className={`mx-auto transition-colors ${isDark ? 'bg-primarycolor-900' : 'bg-white'}`}>
        {/* statistics */}
        <Stats />
     
        <section id="about">
          <ProgramAI />
        </section>

    {/* How Career Compass work */}
        <section id="howItWorks" className={`py-8 px-4 transition-colors ${isDark ? 'bg-primarycolor-800' : 'bg-secondarycolor-50'}`}>
            <div className='max-w-6xl mx-auto'>
                <h1 className='text-primarycolor-500 text-2xl md:text-3xl text-center'>How career Compass works</h1>
                <p className={`text-center py-4 text-sm md:text-base max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Our AI-powered platform guides you through every step of your educational journey.</p>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-8'>
                    <div className='flex flex-col items-center text-center space-y-4'>
                        <div className='bg-secondarycolor-300 flex items-center justify-center rounded-full w-12 h-12'>
                            <span className='text-white font-semibold'>1</span>
                        </div>
                        <h2 className='text-secondarycolor-300 text-xl md:text-2xl font-semibold'>Profile Analysis</h2>
                        <p className={`text-sm md:text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>AI analyzes your academic background, interests, and career goals to create a comprehensive profile.</p>
                    </div>

                    <div className='flex flex-col items-center text-center space-y-4'>
                        <div className='bg-primarycolor-500 flex items-center justify-center rounded-full w-12 h-12'>
                            <span className='text-white font-semibold'>2</span>
                        </div>
                        <h2 className='text-primarycolor-400 text-xl md:text-2xl font-semibold'>Smart Matching</h2>
                        <p className={`text-sm md:text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Advanced algorithms match you with programs and institutions that align with your profile and preferences.</p>
                    </div>

                    <div className='flex flex-col items-center text-center space-y-4'>
                        <div className='bg-secondarycolor-300 flex items-center justify-center rounded-full w-12 h-12'>
                            <span className='text-white font-semibold'>3</span>
                        </div>
                        <h2 className='text-secondarycolor-300 text-xl md:text-2xl font-semibold'>Guided Application</h2>
                        <p className={`text-sm md:text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Get personalized guidance, track applications, and receive AI-generated reports throughout your journey.</p>
                    </div>
                </div>
            </div>
        </section>
        <Testimony />
        <section id="contact" >
          <Footer />
        </section>
     </div>
    </>

  );
}

export default Home;
