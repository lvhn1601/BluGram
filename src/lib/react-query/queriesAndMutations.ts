import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';
import { createComment, createPost, createUserAccount, deletePost, followAction, getCurrentUser, getInfinitePosts, getPostById, getRecentPosts, getUserByUsername, getUsers, postAction, searchPost, signInAccount, signOutAccount, updatePost, updateUser } from '../supabase/api';

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: any) => createUserAccount(user),
  })
}

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: {
      email: string;
      password: string;
    }) => signInAccount(user),
  })
}

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  })
}

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: any) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
    }
  });
}

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  })
}

export const useLikePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, postId, liked }: { userId: string, postId: string; liked: boolean}) => postAction('post_likes', userId, postId, liked),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.id]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      })
    }
  })
}

export const useSavePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, postId, liked }: { userId: string, postId: string; liked: boolean}) => postAction('saves', userId, postId, liked),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })
    }
  })
}

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser
  })
}

export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId
  })
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: any) => updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.id]
      })
    }
  })
}

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: any) => createComment(comment),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.postId]
      })
    }
  })
}

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, imagePath }: { postId: string, imagePath: string }) => deletePost(postId, imagePath),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
    }
  })
}

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts as any,
    initialPageParam: null,
    getNextPageParam: (lastPage: any[]) => {
      if (lastPage && lastPage.length === 0) {
        return null;
      }

      const lastId = lastPage[lastPage.length - 1].id;
      return lastId;
    },
  })
}

export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPost(searchTerm),
    enabled: !!searchTerm
  })
}

export const useGetUsers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(),
  });
};

export const useGetUserByUsername = (username: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_USERNAME, username],
    queryFn: () => getUserByUsername(username),
    enabled: !!username,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: any) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_USERNAME, data?.username],
      });
    },
  });
}

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ followed, userId, followBy, username }: { followed: boolean; userId: string; followBy: string, username: string }) => followAction(followed, userId, followBy, username),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_USERNAME, data?.username]
      })
    }
  })
}