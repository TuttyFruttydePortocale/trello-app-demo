'use client'

import { useBoardStore } from '@/store/BoardStore'
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from '@hello-pangea/dnd'
import { XCircleIcon } from '@heroicons/react/24/outline'
import renderUrl from "@/lib/renderUrl"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

type Props = {
  todo: Todo
  taskIndex: number
  onColumn: TypedColumn
  innerRef: (element: HTMLElement | null) => void
  draggableProps: DraggableProvidedDraggableProps
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined
}

function TodoCard({todo, taskIndex, onColumn, innerRef, draggableProps, dragHandleProps}: Props) {
  const[deleteTaskOnDB] = useBoardStore((state) => [
    state.deleteTaskOnDB,
  ])
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if(todo.image){
      const fetchImage = async () => {
        const url = await renderUrl(todo.image!)
        if(url){
          setImageUrl(url.toString())

        }

      }
      fetchImage()
    }
  }, [todo])
  return (
    <div className='bg-white rounded-md space-y-2 drop-shadow-md'
     {...draggableProps} {...dragHandleProps} ref={innerRef}>
      <div className='flex justify-between items-center p-5'>
        <p>{todo.title}</p>
        <button className='text-red-300 hover:text-red-600' onClick={() => deleteTaskOnDB(todo, onColumn, taskIndex)}>
          <XCircleIcon className='ml-5 h-8 w-8'/>
        </button>
      </div>
      {imageUrl && (
        <div className='h-full w-full rounded-b-md'>
          <Image 
          src={imageUrl}
          alt="Task image"
          width={400}
          height={200}
          className="w-full object-contain rounded-b-md"/>
        </div>
      )}

      </div>
  )
}

export default TodoCard