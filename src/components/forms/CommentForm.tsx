import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CommentValidation } from "@/lib/validation"
import { useCreateComment } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"
import { useToast } from "../ui/use-toast"
import Loader from "../shared/Loader"

type CommentFormProps = {
  postId: string | undefined;
}

function CommentForm({ postId }: CommentFormProps) {
  const { user } = useUserContext();
  const { mutateAsync: createComment, isPending: isLoadingCreate } = useCreateComment();
  
  const { toast } = useToast();

  // 1. Define your form.
  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      details: '',
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof CommentValidation>) {
    const newPost = await createComment({
      ...values,
      userId: user.id,
      postId: postId || '',
    })

    if (!newPost) {
      toast({
        title: 'Comment failed. Please try again!',
      })
    }

    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-center w-full">
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormControl>
              <Input type="text" className="shad-input" placeholder="Say something..." {...field} />
            </FormControl>
          )}
        />

        <Button type="submit" className="shad-button_primary" disabled={isLoadingCreate}>
          {isLoadingCreate ? (
            <div className="flex-center gap-2">
              <Loader /> 
            </div>
          ) : <img src="/assets/icons/chat.svg" className="invert-white" />}
          
        </Button>
      </form>
    </Form>
  )
}

export default CommentForm