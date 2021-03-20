import { query as q } from 'faunadb';   
import {Query, Queries} from '../query' 
import { collection } from '../collection';
import { fields } from './fields';

export function tables(): any  {

    const rows = collection("rows");
    const fields = collection("fields");
    const tables = collection("table")
    return {

        create() {
            return Queries()
        },
}

}
