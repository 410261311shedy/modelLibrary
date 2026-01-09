import * as OBC from "@thatopen/components"
import * as FRAGS from "@thatopen/fragments"
import { DataEnhancerSource } from "./src";

export class DataEnhancer extends OBC.Component {
    //bim's components have to be singletons
    //just 1 single instance of them muts exist in the same manager
    static uuid ="eac0cbbd-7740-4329-968d-b2779f16a4bb" as const
    enable = true;

    readonly sources = new FRAGS.DataMap<string,DataEnhancerSource>()
    
    async getData(items: OBC.ModelIdMap){
        // use this to know exact fragments model the ID belongs
        const fragments = this.components.get(OBC.FragmentsManager)
        //give extra information attached to each item
        const result: OBC.ModelIdDataMap<Record<string,any>> = new FRAGS.DataMap();
        for(const [modelId,_localIds] of Object.entries(items)){
            const model = fragments.list.get(modelId)
            if(!model)continue
            const localIds = [..._localIds]
            //get whole set of items
            const itemsData = await model.getItemsData(localIds)
            for(const[source,config] of this.sources.entries()){
                const sourceData = await config.data()
                for(const attributes of itemsData) {
                    const itemExternalData = config.matcher(attributes,sourceData)
                    if(!itemExternalData) continue

                    let modelResult = result.get(modelId)
                    if(!modelResult){
                        modelResult = new FRAGS.DataMap()
                        result.set(modelId,modelResult)
                    }
                }
            }
        }
    }
}