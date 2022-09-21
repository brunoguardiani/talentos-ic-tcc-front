/* eslint-disable import/prefer-default-export */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../api'
import { handleNotAuthorized } from '../utils/requests'

export const useGetTechnologies = async () => {
  const navigate = useNavigate()

  const [technologies, setTechnologies] = useState([])
  const response = await api.get(`/tecnologias`)

  if (response.data.message) {
    if (response.data.error) {
      toast.error(response.data.message)
      handleNotAuthorized(response, navigate)
      return {}
    }
    toast.success(response.data.message)
  }

  setTechnologies(response.data.rows)

  return { technologies }
}

export const useTechnologyRoutes = () => {
  const navigate = useNavigate()

  const createTechnology = async (descriptions) => {
    if (!descriptions || descriptions.length === 0) {
      toast.error(
        'O campo "Descrição" não pode estar vazio para criar uma tecnologia.'
      )
      return
    }

    const response = await api.post(
      `/tecnologias`,
      descriptions.map((description) => ({ description }))
    )

    if (response.data.message) {
      if (response.data.error) toast.error(response.data.message)
      else toast.success(response.data.message)
    }

    handleNotAuthorized(response, navigate)
  }

  return { createTechnology }
}
