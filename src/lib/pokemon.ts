
import { queryOptions } from '@tanstack/react-query'
import { getVideoComments } from './actions'
import { CommentType } from './definitions'


export const fetchVideoComments = (videoId:string | undefined)=>{
 return queryOptions({
  queryKey: ['getComments', videoId],
  queryFn: async () => {
    const response = await getVideoComments(videoId as string)
    return response as Array<CommentType>
  },
})
}
