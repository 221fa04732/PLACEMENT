import Link from 'next/link';
import Footer from './component/Footer';
import CarrerPath from './component/Company';
import ContactUs from './component/ContactUs';
import PlacementBarChart from './component/Graph';

export default function HomePage() {
  return (<>
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white">
      <main className="flex flex-col justify-center items-center text-center flex-1 max-w-6xl mx-auto px-6">
        <div className='w-full flex justify-end p-4 mt-4'>
          <button className='bg-green-400 px-4 py-2 text-white rounded-md'>Login</button>
        </div>
        <div className='grid grid-cols-1 w-full md:grid-cols-2'>
          <div>
            <img src="./management.png" />
          </div>
          <div className='flex flex-col justify-center items-center p-4'>
            <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 p-4 mt-2">
            Student Placement Data Management Console
            </h2>
            <div className="flex gap-6 my-6">
              <Link href="/student" className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium shadow-md hover:bg-blue-700 transition duration-200 ease-in-out">
                Get Started
              </Link>
                <Link href='/upload' className="px-6 py-3 bg-gray-800 text-white rounded-lg text-lg font-medium shadow-md hover:bg-gray-700 transition duration-200 ease-in-out">
                Upload Data
                </Link>
            </div>
          </div>
        </div>
      </main>

      <div className='w-full'>
        <PlacementBarChart />
      </div>
      
    <div className='pt-12'>
      <CarrerPath />
    </div>
    <div>
      <ContactUs />
    </div>
    
    </div>
    <div>
      <Footer />
    </div>
    </>
  );
}
