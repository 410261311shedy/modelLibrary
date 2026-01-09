import * as FRAGS from "@thatopen/fragments"

export interface DataEnhancerSource {
    data:()=>Promise<any[]>;
    matcher: (attr: FRAGS.ItemData, data:any[]) => any[] | null
}