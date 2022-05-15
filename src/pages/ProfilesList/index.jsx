/* eslint-disable react/jsx-no-bind */
import React, { useEffect, useState } from 'react'
import './style.css'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import { SearchBox, SelectBox } from '../../components/FormElements'
import Aside from './Aside'
import Pagination from '../../components/Pagination'
import ProfileCard from './ProfileCard'
import { useGetProfiles } from '../../hooks/profile'
import { sanitizeStringToSearch } from '../../utils/conversions'
import ButtonRectangle from '../../components/Buttons/ButtonRectangle'
import {
  itemsPerPageNumbers,
  itemsPerPageOptions,
} from '../../utils/constants/project'

function ProfilesList() {
  const navigate = useNavigate()
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageNumbers[2])

  const [searchedTerm, setSearchedTerm] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { profiles, getProfilesByQuery, count } = useGetProfiles(itemsPerPage)
  const totalPages = Math.ceil(count / itemsPerPage)

  useEffect(() => {
    getProfilesByQuery(`/`)
  }, [itemsPerPage])

  function handleSubmitFilters(filters) {
    let newQuery = ''

    Object.entries(filters).forEach((filter) => {
      const sanitizedValue = sanitizeStringToSearch(filter[1])
      if (!sanitizedValue) return
      newQuery += `&${filter[0]}=${sanitizedValue}`
    })

    if (!searchedTerm) {
      getProfilesByQuery(newQuery)
    } else {
      getProfilesByQuery(
        `${newQuery}&technologies=${sanitizeStringToSearch(searchedTerm)}`
      )
    }
  }

  function handleHeaderSearch() {
    getProfilesByQuery(`&technologies=${sanitizeStringToSearch(searchedTerm)}`)
  }

  function handlePaginate() {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      getProfilesByQuery(`&pageNumber=${currentPage + 1}`)
    } else {
      setCurrentPage(1)
      getProfilesByQuery(`&pageNumber=1`)
    }
  }

  return (
    <Layout
      superHeaderChildren={
        <ButtonRectangle
          key="btn-profile"
          label="Pesquisar Vagas"
          onClick={() => navigate('/')}
          className="is-blue header-button"
        />
      }
      headerLeftChildren={
        <SearchBox
          className="search-box"
          label=""
          placeholder="Pesquisar perfil por tecnologia"
          value={searchedTerm}
          onChange={(e) => setSearchedTerm(e.target.value)}
          onSearch={handleHeaderSearch}
          searchButton
        />
      }
    >
      <section id="main">
        <div id="profiles-container">
          <Aside handleSubmitFilters={handleSubmitFilters} />

          <div className="right-container">
            <div id="label">
              <span>Perfis ({count} resultados)</span>
              <span className="page-input-container">
                Exibir
                <SelectBox
                  className="page-input"
                  initialOption=""
                  value={itemsPerPage}
                  options={itemsPerPageOptions}
                  onChange={(e) => setItemsPerPage(e.target.value)}
                />
              </span>
            </div>

            <div id="profiles">
              {profiles?.rows?.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>

            {count / itemsPerPage > 1 ? (
              <Pagination
                onPageChange={handlePaginate}
                totalPages={totalPages}
                pageNumber={currentPage}
              />
            ) : (
              false
            )}
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default ProfilesList
