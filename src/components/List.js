import React from 'react'
import { motion } from 'framer-motion'
import { FaEdit, FaTrash } from 'react-icons/fa'

const List = ({ items, removeItem, editItem }) => {
  return (
    <div>
      {items.map((item) => {
        const { id, title } = item
        return (
          <ul className='p-2 ' key={id}>
            {/*  <div className=' border-2 border-indigo-600  rounded-full '></div>*/}
            <motion.div
              whileInView={{ x: [-100, 0], opacity: [0, 1] }}
              transition={{ duration: 0.8 }}
            >
              <div className='flex-grow rounded border-r-indigo-900 border-4 '>
                <h2 className='text-gray-900 title-font font-medium'>
                  {title}
                </h2>
                <div className='text-gray-500'>
                  <button
                    className='mr-3'
                    type='button'
                    onClick={() => editItem(id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className=''
                    type='button'
                    onClick={() => removeItem(id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </motion.div>
          </ul>
        )
      })}
    </div>
  )
}

export default List
