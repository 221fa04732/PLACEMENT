import {prisma} from "@/app/db";
import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";

interface student {
    name    :   string
    regNo   :   string
    batch   :   string
    company   : string
    package  :  string
    branch  :   string
    placedDate : string
}

export async function POST(req: NextRequest) {

    try{

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const text = await file.text();

        const { data, errors } = Papa.parse<student>(text, { header: true });
        if(errors){
            NextResponse.json({
              message : "Error While Parsing"
            })
        }

        const validData : student[] = data.filter(student => student.name && student.regNo && student.batch && student.company && student.package && student.branch && student.placedDate);

        const user = await prisma.student.createMany({
            data : validData,
            skipDuplicates : true
        })

        if(!user){
            return NextResponse.json({
                message : "Error While Storing"
            })
        }
        
        return NextResponse.json({
            user,
            message : "Data Uploaded Sucessfully"
        })
    }
    catch(error){
        return NextResponse.json({
            error,
            message : "Internal Server Error"
        })
    }
}
