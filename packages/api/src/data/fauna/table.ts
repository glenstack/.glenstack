import { query as q } from 'faunadb';   
import {Query} from './query' 

export function table(this: any, name: string = ''): any  {
    const self  = this;

    const rows = self.collection(name);
    const fields = self.collection(name+"_fields");
    const table_to_fields = self.collection(name+"_to_fields");
    return {
        async create() {
            return [await rows.create(), await fields.create(), await table_to_fields.create()]
        },
        get() {
            const inputs = { rows };
            
            return self.query(Query(
                inputs,
                q.Get(q.Var('ref')))
            );
        },

        add_field(fieldName: string) {
            
        }
     
}

}
