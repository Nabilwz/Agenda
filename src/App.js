import React, { useState, useEffect } from 'react'
import List from './components/List'
import Alert from './components/Alert'
import './App.css'
import * as XLSX from 'xlsx/xlsx.mjs'
import { motion } from 'framer-motion'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { CSVLink } from 'react-csv'

const getLocalStorage = () => {
  let list = localStorage.getItem('list')
  if (list) {
    return (list = JSON.parse(localStorage.getItem('list')))
  } else {
    return []
  }
}

const App = () => {
  const [name, setName] = useState('')
  const [list, setList] = useState(getLocalStorage || [])
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)
  const [alert, setAlert] = useState({
    show: false,
    msg: '',
    type: '',
    color: '',
  })
  const [fileName, setFileName] = useState(null)
  const [columns, setColumns] = useState([])

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list))
  }, [list])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name) {
      showAlert(true, 'Error', 'Please Enter Value', 'bg-indigo-400')
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editId) {
            return { ...item, title: name }
          }
          return item
        })
      )
      setName('')
      setEditId(null)
      setIsEditing(false)
      showAlert(true, 'succes', 'value changes', 'bg-cyan-400')
    } else {
      showAlert(true, 'succes', 'Item added to the list', 'bg-green-400')
      const newItem = { id: new Date().getTime().toString(), title: name }
      setList([...list, newItem])
      setName('')
    }
  }
  const showAlert = (show = false, type = '', msg = '', color = '') => {
    setAlert({ show, type, msg, color })
  }
  const removeItem = (id) => {
    showAlert(true, 'Done', 'Item Removed item from list', 'bg-red-400')
    setList(list.filter((item) => item.id !== id))
  }
  const editItem = (id) => {
    const editItem = list.find((item) => item.id === id)
    setIsEditing(true)
    setEditId(id)
    setName(editItem.title)
  }
  const clearList = () => {
    showAlert(true, 'danger', 'Empty List')
    setList([])
  }

  const exportFile = async (e) => {
    const file = e.target.files[0]
    setFileName(file.name)

    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: '',
    })

    setColumns(jsonData)
    setList(columns)
    console.log(jsonData)
  }

  const csvReport = {
    filename: 'Report.csv',
    data: list,
  }

  return (
    <div className='  sm:px-96 sm:py-5'>
      {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
      <div className='text-center  border p-5 shadow-2xl shadow-indigo-600 rounded-lg  '>
        <form
          action=''
          onSubmit={handleSubmit}
          className='bg-gray-800 rounded p-4'
        >
          <h3 className='text-4xl text-white'>Agenda</h3>
          <div className=''>
            <input
              type='text'
              className='shadow appearance-none border  rounded w-1/2 py-2 px-3 text-gray-700 m-3 leading-tight focus:border focus:shadow-outline"'
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <button
              className='flex-shrink-0 bg-indigo-500 hover:bg-indigo-700 border-indigo-500 hover:border-indigo-700 text-sm border-4 text-white py-1 px-2 rounded-xl'
              type='submit'
            >
              {isEditing ? 'Edit ' : 'Add'}
            </button>
          </div>
        </form>
        {list.length > 0 && (
          <div className=''>
            <List items={list} removeItem={removeItem} editItem={editItem} />
            <div className='grid grid-cols-1'>
              <button
                className='bg-transparent hover:bg-indigo-500 text-indigo-700 font-semibold hover:text-white py-2 px-4 border border-indigo-500 hover:border-transparent rounded-xl '
                onClick={clearList}
              >
                Clear items
              </button>
              <input
                type='file'
                className='bg-transparent hover:bg-cyan-500 text-cyan-700 font-semibold hover:text-white py-2 px-4 border border-cyan-500 hover:border-transparent rounded-xl mt-4'
                onClick={exportFile}
              />
              <div className='bg-transparent hover:bg-indigo-500 text-indigo-700 font-semibold hover:text-white py-2 px-4 border border-indigo-500 hover:border-transparent rounded-xl mt-4'>
                <CSVLink {...csvReport}>Export to csv</CSVLink>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className='mt-6'>
        {fileName && <p className=''> Name of File: {fileName}</p>}

        {fileName && <span className=''> AGENDA:</span>}

        {columns.map((item) => {
          return (
            <>
              <ul className='p-2 '>
                {/*  <div className=' border-2 border-indigo-600  rounded-full '></div>*/}
                <motion.div
                  whileInView={{ x: [-100, 0], opacity: [0, 1] }}
                  transition={{ duration: 0.8 }}
                >
                  <div className='flex-grow rounded border-r-indigo-900 border-4 '>
                    <div className='text-gray-900 title-font font-medium'>
                      {item}
                    </div>
                  </div>
                </motion.div>
              </ul>
            </>
          )
        })}
      </div>
    </div>
  )
}

export default App
