import OthersSearchedFor from '@/components/cui/OthersSearchedFor'
import SearchLayout from '@/components/cui/SearchLayout'
import { Skeleton } from '@/components/ui/skeleton'
import { searchQueries } from '@/lib/actions'
import { SearchParams } from '@/types/definitions.types'
import React, { Suspense } from 'react'

const page = async({searchParams}:{searchParams:Promise<SearchParams>}) => {
  const query1 = await searchParams
  const newQuery =  query1?.query
  const {videosQuery, usersQuery}= await searchQueries(newQuery as string)
  return (
    <main className=' h-screen flex relative'>
      <section className=' h-full w-full max-w-[calc(100%-400px)]'>
        <SearchLayout users={usersQuery} videos={videosQuery}/>
      </section>
      <section className=' relative grow '>
        <div className='fixed w-full right-[60px] space-y-3 max-w-[310px] top-[110px] '>
          <Suspense fallback={<div className=' space-y-2'>{Array(10).fill("_").map((_, index)=> <Skeleton key={index} className="h-4 w-full bg-muted-custom" />)}</div>}>
            <OthersSearchedFor query={newQuery as string}/>
          </Suspense>   
        </div>
      </section>
    </main>
  )
}

export default page
