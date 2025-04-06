'use client'
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Clock7, Search, Trash, TrendingDown, TrendingUp, X } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { fetchAllSearches, updateSearches } from '@/lib/actions'
import { Skeleton } from '../ui/skeleton'
import { nanoid } from "nanoid";
import { toast } from 'sonner'



const SearchInput = () => {

    const searchParams = useSearchParams();
        //const pathname = usePathname();
    const { replace } = useRouter();

    const [allResults, setAllResults] = useState<[string, number][]>();

    const [mySearches, setMySearches] = useState<{title:string, id:string, createdAt:string}[]>([])

          useEffect(()=>{
            const fetchHistory =  sessionStorage?.getItem('searches')
            if(fetchHistory){
              setMySearches(JSON.parse(fetchHistory));
            }
            
        
            //update searches with current search query
            const handleAllSearches = async() =>{
                const response = await fetchAllSearches();
                setAllResults(response);
            }

            handleAllSearches();
            // eslint-disable-next-line
            
          },[]);

    const handleSubmit =async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        const formData = new FormData(e.currentTarget);
        const inputValue = formData.get("search"); 
        if(!inputValue){
          toast.error(`Please enter a search term`)
          return;
      }


        const searchHistory = [...mySearches, {title:inputValue as string, id:nanoid(), createdAt:new Date().toISOString()}]
        setMySearches(searchHistory);
        sessionStorage.setItem('searches', JSON.stringify(searchHistory));

        await updateSearches(inputValue as string);
        if (inputValue) {
            params.set('query', inputValue as string);
          }else {
            params.delete('query');
            return
          }
        replace(`/search?${params.toString()}`);
    }

    const handleRemove =(id:string)=>{
      const searchHistory = mySearches.filter((item)=>item.id !== id);
      setMySearches(searchHistory);
      sessionStorage.setItem('searches', JSON.stringify(searchHistory));
    }

    const clearItems = ()=>{
      setMySearches([]);
      sessionStorage.removeItem('searches');
    }
  return (
    <section className=' space-y-3.5'>
        <form onSubmit={handleSubmit} className=' relative'>
            <Input defaultValue={searchParams.get("query") || ""} name='search' placeholder='Hello' className=' z-20 bg-muted-custom rounded-full py-5 pl-10
            placeholder:text-background/50 caret-primary-custom'/>
            <Search className=' absolute top-1/2 left-3 -translate-y-1/2 '/>
        </form>

        <div className=' space-y-1'>
            <div className=' flex justify-between text-sm text-background/65 leading-6 py-1 font-semibold'>Recent Searches
            <Button onClick={clearItems} size={'icon'}><Trash/></Button>
            </div>
            <ul className=' space-y-4'>
              {mySearches?.map((item, index)=>(
                <Link key={index} className=' block' href={`/search?${item?.title}`}>
                    <li className='flex items-center gap-2 font-semibold transition-all duration-500 text-lg text-muted-custom-text hover:text-primary-custom'>
                        <Clock7/>
                        <span className=' text-background/90'>{item?.title}</span>
                        <Button onClick={()=> handleRemove(item?.id)} variant={'default'} size={'icon'} className=' bg-foreground rounded-full ml-auto'><X/></Button>
                    </li>
                </Link>
              ))}
                
            </ul>
        </div>

        <div className=' space-y-1'>
            <h1 className=' text-sm text-background/65 leading-6 py-1 font-semibold'>You May Also Like</h1>
            <ul className=' space-y-4'>
              {!allResults && Array(10).fill("_").map((_, index)=> <Skeleton key={index} className=' w-full h-4 bg-muted-custom '/>)}
              {allResults && allResults?.map((item, index) => (
                <Link key={index} className=' block' href={`/search?${item?.at(0)}`}>
                    <li className='flex items-center gap-2 font-semibold transition-all duration-500 text-base text-muted-custom-text hover:text-primary-custom'>
                        {item?.at(1) as number / 2 == 1 ? <TrendingUp className=' text-green-500'/>:  <TrendingDown className=' text-primary-custom'/>}
                        <span className=' text-background/90'>{item?.at(0)}</span>
                    </li>
                </Link>
              ))}
                
            </ul>
        </div>
    </section>
    
  )
}

export default SearchInput