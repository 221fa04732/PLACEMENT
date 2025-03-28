import {prisma} from "@/app/db";
import { NextResponse } from "next/server";

export async function GET(){
    
    try{
        const data = await prisma.student.findMany({});

        return NextResponse.json({
            data,
            message : "Fetching Student Detail Sucessful!"
        })
    }
    catch(error){
        return NextResponse.json({
            error,
            message : "Internal Server Error"
        })
    }
}