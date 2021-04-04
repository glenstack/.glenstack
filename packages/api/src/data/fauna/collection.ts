import { query as q } from 'faunadb';
import { Query } from './query'

export function collection(this: any, name: string = ''): any {
    const self = this;
    const ref = q.Collection(name);

    return {

        get_ref(){
            return ref
        },

        create() {
            const inputs = { name }

            return Query(
                inputs,
                q.CreateCollection({ name })
            );
        },
        get() {
            const inputs = { ref }

            return Query(
                inputs,
                q.Get(q.Var('ref')))
                
        },

        insert(data: Record<string, any>) {
            const inputs = { ref };
            return Query(inputs, q.Create(q.Var('ref'), {
                data
            }))
        },

        findById(id: string) {
            const inputs = { ref };

            return Query(
                inputs,
                q.Get(q.Ref(q.Var('ref'), id)))
        },

        findMany(){
            const inputs = { ref };
            return Query(inputs,q.Map(
                q.Paginate(q.Documents(q.Var('ref'))),
                q.Lambda(x => q.Select("data",q.Get(x)))
              ))
        },

        date() {

            return Query({}, q.ToDate("2020-03-12"))

        }

    }

}
