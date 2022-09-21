/* eslint-disable import/prefer-default-export */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../api'
import { handleNotAuthorized } from '../utils/requests'

export const useGetProfiles = async (pageNumber, itemsPerPage, filters) => {
  const [profiles, setProfiles] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [count, setCount] = useState(0)

  const buildQuery = () => {
    const query = []
    query.push(`pageNumber=${pageNumber}`)
    query.push(`itemsPerPage=${itemsPerPage}`)
    Object.keys(filters).forEach((field) => {
      if (field === 'filter' && filters[field]) {
        query.push(`technologies=${filters[field]}`)
      } else if (filters[field]) query.push(`${field}=${filters[field]}`)
    })
    return query.join('&')
  }

  const response = await api.get(`/perfis?${buildQuery()}`)

  if (response.data.error && response.data.message) {
    toast.error(response.data.message)
    return {}
  }

  setProfiles(response.data.rows)
  setCount(response.data.count)
  setTotalPages(Math.ceil(response.data.count / itemsPerPage))

  return { profiles, totalPages, count }
}

export const useGetProfileById = async (id, displayError = true) => {
  const [profile, setProfile] = useState()

  if (id === -1) return {}
  const response = await api.get(`/perfis/${id}`)

  if (response.data.message) {
    if (displayError) toast.error(response.data.message)
    return {}
  }

  setProfile(response.data)

  return { profile }
}

export const useGetOwnProfile = async (id) => {
  const navigate = useNavigate()
  const [bestJobs, setBestJobs] = useState([])

  const response = await api.get(`/perfis/meuperfil/${id}`)

  if (response.data.message) {
    if (response.data.error) {
      toast.error(response.data.message)
      handleNotAuthorized(response, navigate)
      return {}
    }
    toast.success(response.data.message)
  }

  setBestJobs(response.data)
  return { bestJobs }
}

export const useProfileRoutes = () => {
  const navigate = useNavigate()

  const createProfile = async (
    userId,
    birthDate,
    scholarity,
    searchable,
    knowledge,
    technologies,
    languages,
    linkResume
  ) => {
    if (searchable === undefined)
      toast.error('O campo "Aparecer na busca" não pode estar vazio.')

    const response = await api.post(`/perfis`, {
      userId,
      birthDate,
      scholarity,
      searchable,
      knowledge,
      technologies,
      languages,
      linkResume,
    })

    if (response.data.message) {
      if (response.data.error) toast.error(response.data.message)
      else toast.success(response.data.message)
    }

    handleNotAuthorized(response, navigate)
  }

  const updateProfile = async (
    id,
    userId,
    birthDate,
    scholarity,
    searchable,
    knowledge,
    technologies,
    languages,
    linkResume
  ) => {
    if (searchable === undefined)
      toast.error('O campo "Aparecer na busca" não pode estar vazio.')

    const response = await api.patch(`/perfis/${id}`, {
      userId,
      birthDate,
      scholarity,
      searchable,
      knowledge,
      technologies,
      languages,
      linkResume,
    })

    if (response.data.message) {
      if (response.data.error) toast.error(response.data.message)
      else toast.success(response.data.message)
    }

    handleNotAuthorized(response, navigate)
  }

  const deleteProfile = async (id) => {
    const response = await api.delete(`/perfis/${id}`)

    if (response.data.message) {
      if (response.data.error) toast.error(response.data.message)
      else toast.success(response.data.message)
    }

    handleNotAuthorized(response, navigate)
  }

  return { createProfile, updateProfile, deleteProfile }
}
