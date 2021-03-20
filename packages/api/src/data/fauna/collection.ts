import { query as q } from 'faunadb';   
import {Query} from './query' 

export function collection(this: any, name: string = ''): any  {
    const self  = this;
    const ref = q.Collection(name);

    return {
        create() {

            const inputs = { name };

            return self.query(Query(
                inputs,
                q.CreateCollection({ name })
            ));
        },
        get() {
            const inputs = { ref };
            
            return self.query(Query(
                inputs,
                q.Get(q.Var('ref')))
            );
        },

        date(){

            return self.query(Query({},q.ToDate("2020-03-12")))

        }
     
}

}
