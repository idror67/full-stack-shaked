import { useParams } from "react-router-dom"
import { trpc } from "../../../trpc";
import Dialog from '@mui/material/Dialog';
import { useSignal } from "@preact/signals-react";
import { useForm } from "react-hook-form";
interface BookDetailsInterface {
    id: string;
    title: string;
    authorId: string;
    description: string;
}
export function BookDetailsPage() {
    const params = useParams()
    const id = params.id ?? '';
    const book_details_query = trpc.book.bookDetails.useQuery(id);
    const is_edit_open = useSignal(false)
    const {register, handleSubmit} = useForm<BookDetailsInterface>({
        defaultValues: {...book_details_query.data , description: book_details_query.data?.description ?? '', } 
    });
    const authors_details_query = trpc.author.list.useQuery()
    const book_edit_mutation = trpc.book.bookEdit.useMutation({
        onSuccess: () => {
            console.log('refetch data')
            book_details_query.refetch()
        }
    })
    if (book_details_query.isLoading) return <div>Loading...</div>
    if (book_details_query.data === null || book_details_query.data === undefined) return <div>No book with this id</div>
    return <main>
        <h1> {book_details_query.data.title}</h1>
           
        <p>
            {book_details_query.data.description}
        </p>
        <h5>{book_details_query.data.publishedAt}</h5>

        <Dialog open={is_edit_open.value}>
            <button onClick={() => is_edit_open.value = false}>close</button>
            <h1>wow</h1>
            <form onSubmit={handleSubmit((data) => {
                console.log(data);
                book_edit_mutation.mutate(data)
            })}>
                <input type="text" {...register('title')} />
                <input type="text" {...register('description')} />
                <select {...register('authorId')}>
                {authors_details_query?.data?.map((author, index) => <option key={index} value={author.id}>
                    {author.name}
                </option>)}
            </select>
            <button type="submit">update data</button>
            </form>
        </Dialog>
        <button onClick={() => is_edit_open.value = true}>edit</button>
    </main>
}