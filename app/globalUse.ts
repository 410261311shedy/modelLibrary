import {PackageOpen,Building,Boxes,Box,FileBox, Users } from "lucide-react"

export const itemsQuery =[
    {id:'ALL',label:"ALL",icon:PackageOpen},
    {id:'Buildings',label:"Buildings",icon:Building},
    {id:'Products',label:"Products",icon:Boxes},
    {id:'Elements',label:"Elements",icon:Box},
    {id:'2D Drawings',label:"2D Drawings",icon:FileBox},
];

export const itemsQueryForALL =[
    {id:'ALL',label:"ALL",icon:PackageOpen},
    {id:'Building',label:"Buildings",icon:Building},
    {id:'Boxes',label:"Products",icon:Boxes},
    {id:'Box',label:"Elements",icon:Box},
    {id:'FileBox',label:"2D Drawings",icon:FileBox},
    {id:'Team',label:"Team",icon:Users},
];

export const card = [{id:"1",title:"model 1",is3D:"3D",image:"/projecttest.png",category:"Buildings"},
    {id:"2",title:"model 2",is3D:"3D",image:"/projectTest2.png",category:"Buildings"},
    {id:"3",title:"model 3",is3D:"3D",image:"/projectTest3.png",category:"Buildings"},
    {id:"4",title:"model 4",is3D:"2D",image:"/projectTest4.png",category:"2D Drawings"},
    {id:"5",title:"model 5",is3D:"3D",image:"/projectTest5.png",category:"Elements"},
    {id:"6",title:"model 6",is3D:"2D",image:"/projectTest4.png",category:"2D Drawings"},
    {id:"7",title:"model 7",is3D:"2D",image:"/projectTest4.png",category:"2D Drawings"},
    {id:"8",title:"model 8",is3D:"2D",image:"/projectTest4.png",category:"2D Drawings"},
    {id:"9",title:"model 9",is3D:"2D",image:"/projectTest4.png",category:"2D Drawings"},
];