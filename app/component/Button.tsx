"use client"

import axios from 'axios'

export default function Button(props : {
    id : string
}){

    const id : string =props.id;
    return (<button className='bg-red-500 w-full py-2 rounded-md'
        onClick={()=>{deleteStudent(id);}
    }>Delete</button>)
}

async function deleteStudent(id : string) {
    try{
        const user = await axios.put("https://placement-pink.vercel.app/api/deleteStudent",{
            id : id
        })
        if(user){
            console.log(user)
        }
    }
    catch(error){
        console.log(error)
    }
}