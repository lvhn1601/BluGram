import { INewUser } from "@/types";
import { supabase } from "./config";

export async function createUserAccount(user: INewUser) {
  const { data, error } = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
    options: {
      emailRedirectTo: 'http://localhost:5173/signin',
    },
  })

  const newAccount = data.user;
  
  if (!newAccount) return { data: newAccount, error: error }

  const { data: insertData, error: insertError } = await supabase
  .from('Users')
  .insert({
    name: user.name,
    username: user.username,
    email: user.email,
    accountId: newAccount.id,
  })
  .select()

  if (!insertData) return { data: null, error: insertError }
  
  return { data: insertData[0], error: error && insertError }
}

export async function signInAccount(user: {
  email: string;
  password: string;
}) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword(user)

    if (!data.session) throw error;

    return data.session
  } catch (error) {
    console.log(error)
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user: currentAccount }} = await supabase.auth.getUser();

    if (!currentAccount) throw Error;

    // const currentUser = await databases.listDocuments(
    //   appwriteConfig.databaseId,
    //   appwriteConfig.userCollectionId,
    //   [Query.equal('accountId', currentAccount.$id)]
    // )

    const { data: currentUser, error } = await supabase
    .from('Users')
    .select()
    .eq('accountId', currentAccount.id)
    .maybeSingle()

    if (!currentUser) throw error;

    return currentUser;
  } catch (error) {
    console.log(error);
  }
}