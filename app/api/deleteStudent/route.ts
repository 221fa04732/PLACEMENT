import {prisma} from "@/app/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req : NextRequest){

    const {id} =await req.json();

    try{

        const user = await prisma.student.delete({
            where : {
                id : id
            }
        })

        return NextResponse.json({
            user,
            message : "Student Info Deleted"
        })
        
    }
    catch(error){
        return NextResponse.json({
            error,
            message : "Internal Server Error"
        })
    }
}