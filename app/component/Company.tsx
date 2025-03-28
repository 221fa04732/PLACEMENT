export default function CarrerPath(){
    return (<div className="bg-orange-700  text-white">
        <div className="p-16">
            <p className="text-center text-5xl font-bold font-grotesk pb-10">Career Paths After Graduation</p>
            <p className="pb-12 text-md">Our graduates enjoy diverse career paths, with around 90% securing placements in top companies and government sectors, thanks to a strong curriculum and industry partnerships. Approximately 8% pursue higher education at prestigious institutions, supported by a research-driven academic environment and exams like GATE, GRE, and GMAT. We also encourage entrepreneurship, providing resources to help students launch successful ventures. This comprehensive approach ensures our graduates are well-prepared for both professional and academic success.</p>

            <div className={`grid grid-cols-4 gap-y-8 gap-x-16 place-items-center pb-16 transition-all duration-1000`} >
                <img src="tcs.svg"/>
                <img src="ibm.svg"/>
                <img src="Congnizant.svg"/>
                <img src="infosys.svg"/>
                <img src="wipro.svg"/>
                <img src="Hexaware.svg"/>
                <img src="Samsung.svg"/>
                <img src="DBS.svg"/>
            </div>

            <div className="grid grid-cols-2 gap-x-16 gap-y-6">
                <div className="px-20 py-8 border">
                    <p className="text-4xl font-bold pb-4">90%</p>
                    <p className="text-2xl font-medium pb-2">Join a Company</p>
                    <p className="pb-10">Our graduates consistently secure placements in top companies and government sectors, with an impressive average placement rate of around 90% over recent years.</p>
                    
                </div>
                <div className="px-20 py-8 border">
                    <p className="text-4xl font-bold pb-4">8%</p>
                    <p className="text-2xl font-medium pb-2">Go For Higher Education</p>
                    <p className="pb-10">A number of our graduates pursue higher studies, gaining admission to prestigious institutions both in India and abroad.</p>
                </div>
                <div className="px-20 py-8 border">
                    <p className="text-4xl font-bold pb-4">1%</p>
                    <p className="text-2xl font-medium pb-2">Choose Academia and Research</p>
                    <p className="pb-10">A portion of our graduates engage in academia and research, making significant contributions to advancements in computing and technology.</p>
            
                </div>
                <div className="px-20 py-8 border">
                    <p className="text-4xl font-bold pb-4">1%</p>
                    <p className="text-2xl font-medium pb-2">Become  Entrepreneurs  & Consults</p>
                    <p className="pb-10">While the majority of our students enter the workforce or pursue higher education, we also support aspiring entrepreneurs.</p>

                </div>
            </div>
        </div>
    </div>)
}