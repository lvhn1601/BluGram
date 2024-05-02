import { INewPost, INewUser } from "@/types";
import { supabase } from "./config";

// ----- AUTHENTICATION -----
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
  .from('users')
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

    const { data: currentUser, error } = await supabase
    .from('users')
    .select(`
      *,
      saves(
        postId,
        posts(
          *,
          creator (
            id,
            name,
            imageUrl
          ),
          post_likes(
            userId
          )
        )
      ),
      post_likes!LikesPost_userId_fkey(
        posts(
          *,
          creator (
            id,
            name,
            imageUrl
          )
        )
      )
    `)
    .eq('accountId', currentAccount.id)
    .maybeSingle()

    if (!currentUser) throw error;

    return currentUser;
  } catch (error) {
    console.log(error);
  }
}

export async function signOutAccount() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error
  } catch (error) {
    console.log(error)
  }
}

// ----- POST FUNCTION -----

export async function createPost(post: INewPost) {
  try {
    let imagePath, imageUrl;

    const hasImage = post.file?.length > 0;

    // handle upload if having image
    if (hasImage) {
      // create file name for image
      const newImageName = post.userId + Date.now().toString();

      // upload file
      const uploadedFile = await uploadFile(post.file[0], newImageName);
  
      if (!uploadedFile) throw Error;

      imagePath = uploadedFile.path;
  
      // get public url of image
      const { data: { publicUrl: fileUrl } } = supabase.storage.from('media').getPublicUrl(imagePath)

      imageUrl = fileUrl;
    }

    // Convert tags into array
    const tags = (post.tags === '' ? [] : post.tags?.replace(/ /g, '').split(',')) || [];

    // create post
    const { data: newPost, error } = await supabase
      .from('posts')
      .insert({
        creator: post.userId,
        caption: post.caption,
        imageUrl,
        imagePath,
        location: post.location,
        tags,
      })
      .select()

    // delete uploaded file if failed to create post
    if (error) {
      if (hasImage && imagePath)
        await deleteFile(imagePath);
      throw Error;
    }

    return newPost[0];
  } catch (error) {
    console.log(error)
  }
}

// Upload file to Supabase
export async function uploadFile(file: File, name: string) {
  try {
    const { data: uploadedFile, error } = await supabase.storage
    .from('media')
    .upload(`posts/${name}`, file, {
      upsert: true,
    })

    if (error) throw error;

    return uploadedFile;
  } catch (error) {
    console.log(error)
  }
}

// Delete file
export async function deleteFile(filePath: string) {
  try {
    await supabase.storage.from('media').remove([filePath]);

    return { status: 'ok'};
  } catch (error) {
    console.log(error)
  }
}

export async function getRecentPosts() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      creator (
        id,
        name,
        imageUrl
      ),
      post_likes(
        userId
      ),
      comments(id)
    `)
    .limit(20)
    .order('created_at', { ascending: false })

  if (error) throw error;

  return posts;
}

export async function postAction(action: string, userId: string, postId: string, liked: boolean) {
  try {
    if (liked) {
      const { error } = await supabase
        .from(action)
        .delete()
        .match({
          userId,
          postId
        })
      
      if (error) throw error
    } else {
      const { error } = await supabase
        .from(action)
        .insert({
          userId,
          postId,
        })

      if (error) throw error
    }

    return { id: postId }
  } catch (error) {
    console.log(error)
  }
}

export async function getPostById(postId: string) {
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
      *,
      creator (
        id,
        name,
        imageUrl
      ),
      post_likes(
        userId
      ),
      comments(
        id,
        details,
        created_at,
        creator:users!Comments_userId_fkey(id, name, imageUrl)
      )
    `)
    .eq('id', postId)
    .maybeSingle()

    if (error) throw error

    return post;
  } catch (error) {
    console.log(error)
  }
}

export async function updatePost(post: any) {
  const hasFileToUpdate = post.file?.length > 0; // check if has file to update
  const hasDeletedImage = post.deletedFile; // check if creator deleted old file
  
  try {
    let imagePath = post.imagePath, imageUrl = post.imageUrl

    if (hasFileToUpdate) {
      // generate file name for image
      const newImageName = post.userId + Date.now().toString();
      // upload image into storage
      const uploadedFile = await uploadFile(post.file[0], newImageName);
  
      if (!uploadedFile) throw Error;
  
      imagePath = uploadedFile.path;
  
      // get the public url of uploaded image
      const { data: { publicUrl: fileUrl } } = supabase.storage.from('media').getPublicUrl(imagePath)

      imageUrl = fileUrl;
    }

    // Convert tags into array
    const tags = (post.tags === '' ? [] : post.tags?.replace(/ /g, '').split(',')) || [];

    // update post and get the result (array)
    const { data: updatedPost, error } = await supabase
      .from('posts')
      .update({
        caption: post.caption,
        imageUrl: hasDeletedImage ? null : imageUrl,
        imagePath: hasDeletedImage ? null : imagePath,
        location: post.location,
        tags,
      })
      .eq('id', post.postId)
      .select()

    if (error) {
      await deleteFile(imagePath);
      throw error;
    }

    // delete old image when update succesful
    if (hasFileToUpdate || hasDeletedImage) {
      await deleteFile(post.imagePath);
    }

    return updatedPost[0];
  } catch (error) {
    console.log(error)
  }
}

export async function deletePost(postId: string, imagePath: string) {
  try {
    const { error: deletePostError } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)

    if (deletePostError) throw deletePostError

    if (imagePath)
      await deleteFile(imagePath)

    return { status: 'ok' }
  } catch (error) {
    console.log(error)
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number}) {
  try {
    const { data: posts, error} = await supabase
      .from('posts')
      .select(`
      *,
      creator (
        id,
        name,
        imageUrl
      ),
      post_likes(
        userId
      )
    `)
    .limit(10)
    .order('created_at', { ascending: false })
    .not('imageUrl', 'is', null)
    .range(
      pageParam ? (pageParam - 1) * 10 : 0,
      pageParam ? pageParam * 10 - 1 : 10
    )

    if (error) throw error;

    return posts;
  } catch (error) {
    console.log(error)
  }
}

export async function searchPost(searchTerm: string) {
  try {
    const { data: posts, error} = await supabase
    .from('posts')
    .select(`
      *,
      creator (
        id,
        name,
        imageUrl
      ),
      post_likes(
        userId
      )
    `)
    .ilike('caption', `%${searchTerm}%`)

    if (error) throw error;

    return posts;
  } catch (error) {
    console.log(error)
  }
}

// ----- COMMENT FUNCTIONS -----

export async function createComment(comment: any) {
  try {
    const { data: newComment, error } = await supabase
      .from('comments')
      .insert(comment)
      .select()

    if (error) throw error;

    return newComment[0];
  } catch (error) {
    console.log(error)
  }
}

// ----- USERS FUNCTIONS -----

export async function getUsers() {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select(`
        id,
        name,
        username,
        imageUrl,
        posts!Posts_creator_fkey(*),
        followers:follows!follows_userId_fkey(
          users!follows_followBy_fkey(id, name, username, imageUrl)
        ),
        followings:follows!follows_followBy_fkey(
          users!follows_userId_fkey(id, name, username, imageUrl)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error;

    return users;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById(userId: string) {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select(`
        *,
        posts!Posts_creator_fkey(*),
        followers:follows!follows_userId_fkey(
          users!follows_followBy_fkey(id, name, username, imageUrl)
        ),
        followings:follows!follows_followBy_fkey(
          users!follows_userId_fkey(id, name, username, imageUrl)
        )
      `)
      .eq('id', userId)
      .order('created_at', { referencedTable: 'posts', ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) throw error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(user: any) {
  const hasFileToUpdate = user.file?.length > 0; // check if has file to update
  const hasDeletedImage = user.deletedFile; // check if creator deleted old file
  
  try {
    let imagePath = user.imagePath, imageUrl = user.imageUrl

    if (hasFileToUpdate) {
      // generate file name for image
      const newImageName = user.id + Date.now().toString();
      // upload image into storage
      const uploadedFile = await uploadFile(user.file[0], newImageName);
  
      if (!uploadedFile) throw Error;
  
      imagePath = uploadedFile.path;
  
      // get the public url of uploaded image
      const { data: { publicUrl: fileUrl } } = supabase.storage.from('media').getPublicUrl(imagePath)

      imageUrl = fileUrl;
    }

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        name: user.name,
        bio: user.bio,
        imageUrl: hasDeletedImage ? null : imageUrl,
        imagePath: hasDeletedImage ? null : imagePath,
      })
      .eq('id', user.id)
      .select()

    if (error) {
      if (hasFileToUpdate)
        await deleteFile(imagePath)

      throw error;
    }

    // delete old image when update succesful
    if (hasFileToUpdate || hasDeletedImage) {
      await deleteFile(user.imagePath);
    }

    return updatedUser[0]
  } catch (error) {
    console.log(error)
  }
}

export async function followAction(followed: boolean, userId: string, followBy: string) {
  try {
    if (!followed) {
      const { error } = await supabase
        .from('follows')
        .insert({
          userId,
          followBy,
        })
      
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('follows')
        .delete()
        .match({
          userId,
          followBy,
        })
      
      if (error) throw error
    }

    return { id: userId }
  } catch (error) {
    console.log(error)
  }
}