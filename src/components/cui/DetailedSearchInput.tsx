'use client'
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Search, X } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { nanoid } from 'nanoid'
import { updateSearches } from '@/lib/actions'
import { toast } from 'sonner'

const DetailedSearchInput = () => {
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const [query, setQuery] = useState<string | undefined >('');
    const [mySearches, setMySearches] = useState<{title:string, id:string, createdAt:string}[]>([])

    useEffect(()=>{
        const fetchHistory =  sessionStorage?.getItem('searches')
        if(fetchHistory){
            setMySearches(JSON.parse(fetchHistory));
        }
    }, []);

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
    <div className=' space-y-1'>
        <form  onSubmit={handleSubmit} className=' relative'>
            <Input name='search' value={query} onChange={(e)=> setQuery(e.target.value)} placeholder='Find Related Content' className=' focus-visible:ring-0 z-20 bg-muted-custom/10 rounded-full py-5 pl-5
            placeholder:text-background/50 caret-primary-custom'/>
            {query && <Button type='button' onClick={()=> setQuery('')} size={'icon'} className=' size-5 cursor-pointer absolute rounded-full top-1/2 right-1/6 -translate-y-1/2 '>
                <X/>
            </Button>}
            <Button type='button' size={'icon'} disabled className=' disabled:text-white text-white absolute border-l-2 border-l-muted-custom-text bg-transparent rounded-none top-1/2 right-3 -translate-y-1/2 '>
                <Search />
            </Button>
        </form>

        {query && <div className='bg-foreground/75 rounded-xl p-2'>
            <div className=' flex'><Button onClick={clearItems} variant={'link'} size={'sm'} className=' ml-auto'>Clear</Button></div>
            <ul className=' space-y-4'>
                {mySearches?.map(item => <Link key={item?.id} className=' block' href={`/search?${item?.title}`}>
                    <li  className='flex items-center gap-2 font-semibold transition-all duration-500 text-sm text-muted-custom-text hover:text-primary-custom'>
                        <Search className=' size-4'/>
                        <span className=' text-background/90'>{item?.title}</span>
                        <Button onClick={()=> handleRemove(item?.id)} variant={'default'} size={'icon'} className=' bg-foreground rounded-full ml-auto'><X/></Button>
                    </li>
                </Link>)}
            </ul>
        </div>}
    </div>
    
  )
}

export default DetailedSearchInput