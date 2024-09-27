import { MessageSquareMore } from 'lucide-react'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';


export const UserCard = ({ data } : { data: any }) => {
    const [ userName, setUserName] = useState('');
    const [ id, setId ] = useState(0);
    const router = useRouter();
    useEffect( () => {
        const getCookieValue = (name:any) => (
            document.cookie.split('; ').find(row => row.startsWith(`${name}=`))?.split('=')[1]
        )
        setUserName(getCookieValue('username')?? '');
        setId(parseInt(getCookieValue('id')??''));
    },[])

    const handleClick = () => {
        router.push({
            pathname:`http://localhost:3001/posts/search${data.name}`,
            query:{recipientId: data.id}
        })
    }

    return(
        <div className='flex flex-1 flex-row font-sans justify-around items-center bg-background-800 w-3/4 max-h-10 mt-2 mb-2 rounded' onClick={handleClick}>
            <span className="flex flex-1 ml-10 w-2/4 text-[#fff]">{data.name}</span>
            <div>
                <MessageSquareMore className='h-4 w-4 text-fontColor-900'/>
            </div>
        </div>
    )
}