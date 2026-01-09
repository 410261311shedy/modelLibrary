import * as OBC from "@thatopen/components"

export const setupItemsFinder = (components:OBC.Components) =>{
    const finder = components.get(OBC.ItemsFinder);
    //                     find it according to the category name
    finder.create("Walls",[{categories:[/WALL/]}])
    finder.create("All",[{categories:[/ELEMENT/]}])
    finder.create("Door&Windows",[{categories:[/DOOR/,/WINDOW/]}])
    //attribute based search
    finder.create("Drywall T7",[
        {
            attributes:{
                queries:[
                    {name:/NAME/,value:/MURO liviano T7/}
                ]
            }
        }
    ])

    finder.create("Roof",[
        {
            // attributes:{queries:[{name:/Name/,value:/roof/}]},
            categories:[/ELEMENT/],
            relation:{
                name:"IsDefinedBy",
                query:{
                    attributes:{queries:[{name:/Name/,value:/<Default>/}]}
                    },
                },
            },
    ])
}