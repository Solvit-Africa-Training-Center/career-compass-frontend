import ProgramAI from '@/components/cards/ProgramAI';
import ProgramSection from '@/components/cards/ProgramCard';
import Footer from '@/components/Footer';
// import ProgramSection from '@/cards/programCard';
// import ProgramCard from '@/components/cards/programCard';
import NavBar from '@/components/NavBar';
import Testimony from '@/components/Testimony';
import Welcome from '@/components/Welcome';


const Home = () => {
  return (
    <>
      <NavBar />
      {/* <hr /> */}
      <Welcome />
     <div className='bg-primarycolor-100 h-auto'>
        <ProgramSection />
     </div>
     <div className='mx-auto'>
        {/* statistics */}
        <div className='bg-primarycolor-800 py-8 px-4'>
            <div className='max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8'>
                <div className='text-center space-y-2'>
                    <h1 className='text-secondarycolor-300 text-2xl md:text-3xl font-bold'>150+</h1>
                    <p className='text-white text-sm md:text-base'>Students Placed</p>
                </div>
                <div className='text-center space-y-2'>
                    <h1 className='text-secondarycolor-300 text-2xl md:text-3xl font-bold'>10+</h1>
                    <p className='text-white text-sm md:text-base'>Partner Institutions</p>
                </div>
                <div className='text-center space-y-2'>
                    <h1 className='text-secondarycolor-300 text-2xl md:text-3xl font-bold'>11+</h1>
                    <p className='text-white text-sm md:text-base'>Agents</p>
                </div>
                <div className='text-center space-y-2'>
                    <h1 className='text-secondarycolor-300 text-2xl md:text-3xl font-bold'>90%</h1>
                    <p className='text-white text-sm md:text-base'>Success Rate</p>
                </div>
            </div>
        </div>
     
        {/* Features */}
        <ProgramAI />

    {/* How Career Compass work */}
        <div className='bg-secondarycolor-50 py-8 px-4'>
            <div className='max-w-6xl mx-auto'>
                <h1 className='text-primarycolor-500 text-2xl md:text-3xl text-center'>How career Compass works</h1>
                <p className='text-center py-4 text-sm md:text-base max-w-2xl mx-auto'>Our AI-powered platform guides you through every step of your educational journey.</p>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-8'>
                    <div className='flex flex-col items-center text-center space-y-4'>
                        <div className='bg-secondarycolor-300 flex items-center justify-center rounded-full w-12 h-12'>
                            <span className='text-white font-semibold'>1</span>
                        </div>
                        <h2 className='text-secondarycolor-300 text-xl md:text-2xl font-semibold'>Profile Analysis</h2>
                        <p className='text-sm md:text-base text-gray-600 leading-relaxed'>AI analyzes your academic background, interests, and career goals to create a comprehensive profile.</p>
                    </div>

                    <div className='flex flex-col items-center text-center space-y-4'>
                        <div className='bg-primarycolor-500 flex items-center justify-center rounded-full w-12 h-12'>
                            <span className='text-white font-semibold'>2</span>
                        </div>
                        <h2 className='text-primarycolor-400 text-xl md:text-2xl font-semibold'>Smart Matching</h2>
                        <p className='text-sm md:text-base text-gray-600 leading-relaxed'>Advanced algorithms match you with programs and institutions that align with your profile and preferences.</p>
                    </div>

                    <div className='flex flex-col items-center text-center space-y-4'>
                        <div className='bg-secondarycolor-300 flex items-center justify-center rounded-full w-12 h-12'>
                            <span className='text-white font-semibold'>3</span>
                        </div>
                        <h2 className='text-secondarycolor-300 text-xl md:text-2xl font-semibold'>Guided Application</h2>
                        <p className='text-sm md:text-base text-gray-600 leading-relaxed'>Get personalized guidance, track applications, and receive AI-generated reports throughout your journey.</p>
                    </div>
                </div>
            </div>
        </div>
    {/* Testimonial */}
        <Testimony />
        {/* Footer */}
        <Footer />
     </div>
    </>

  );
}

export default Home;
