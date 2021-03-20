import { query as q } from 'faunadb';   
import {Query, Queries} from '../query' 
import { collection } from '../collection';
import { relation } from './relation';
import { print } from 'graphql';

export function fields(name: string = '', table_ref: any): any  {

    const field_collection = collection(name);
    
    return {
        ...field_collection,
       
        insert({name, type, to}: any) {
            if (type === "relation"){
                const _relation = relation(name+"hellosda")
                return q.Do(q.CreateCollection({name:"zata"}),q.Create(
                    q.Ref(q.Collection('zata'), '2'),
                    { data: { name: 'Orwen' } },
                  ),
                  q.Get(q.Ref(q.Collection('zata'), '2')),
                )

            }

            return field_collection.insert({name, type})
        },
        
     
}

}
