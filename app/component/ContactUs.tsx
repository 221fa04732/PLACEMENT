export default function ContactUs() {
    return (
        <div className="flex flex-col">
            <div className=" bg-orange-700 p-24 grid grid-cols-2 text-white font-grotesk">
                <div>
                    <p className="text-6xl pb-2 font-bold">Have a Query? We </p>
                    <p className="text-6xl font-bold pb-16">are here to help</p>
                    <button className="bg-white text-orange-700 border rounded-full py-3 px-5 hover:bg-orange-700 hover:text-white transition-all">Submit a query</button>
                </div>
        
                <div className="flex flex-col items-end">
                    <div className="flex items-end pb-12">
                        <img src="phone-ringing.png" className="h-12 w-12 mr-2 animate-vibrateZigzag"/>
                        <p className="text-5xl">0863-2344700</p>
                    </div>
                    <p className="text-lg">Vignan team is available in from </p>
                    <p className="text-lg">Mon - Sat 9:00 am to 6:00 pm</p>
                </div>
            </div>
            <div className="px-24 py-16">
                <div>
                    <div>
                        <p className="text-5xl font-bold pb-5">Contact Us</p>
                        <p className="w-9/12 text-lg text-gray-600">Connect with us effortlessly; your inquiries, feedback, and curiosity are always welcome – reach out through our Contact Us section for prompt assistance and information</p>
                    </div>
                </div>
                <div className="grid grid-cols-3 place-self-center gap-24 pt-12">
                    <div>
                        <p className="text-2xl font-semibold pb-3">The HoD</p>
                        <p className="pb-3 text-gray-600">For industrial interactions, projects, consultancy, etc. please contact, the HoD</p>
                        <p className="font-bold">hodcse@vignan.ac.in</p>
                    </div>
                    <div>
                        <p className="text-2xl font-semibold pb-3">Phone & Email</p>
                        <p className="pb-3 text-gray-600">For direct assistance, dial our dedicated helpline – your gateway to information and support at your fingertips</p>
                        <p className="pb-3 font-bold">08632344700-479</p>
                        <p className="pb-3 font-bold">+91 9912514034</p>
                        <p className="font-bold">deocse@vignan.ac.in</p>
                    </div>
                    <div>
                        <p className="text-2xl font-semibold pb-3">Feedback</p>
                        <p className="pb-3 text-gray-600">Kindly send your valuable suggestions to</p>
                        <p className="pb-3 font-bold">feedback-survey@vignan.ac.in</p>
                        <div className="pb-3 text-red-500 underline">
                            <a href="#">Student-Exitfeedback</a>
                        </div>
                        <div className="pb-3 text-red-500 underline">
                                <a href="#">Feedback/Survey</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}