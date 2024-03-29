/* eslint-disable */
import React, { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetJobById, useJobRoutes } from '../../hooks/jobs'
import Layout from '../../components/Layout'
import Text from '../../components/Text'
import { localDate, numberToReais } from '../../utils/conversions'
import {
  scholarityLabel,
  jobTypeLabel,
  filterLabel,
} from '../../utils/constants/project'
import ButtonRectangle from '../../components/Buttons/ButtonRectangle'
import './styles.css'
import { translate } from '../../utils/translations'
import ConfirmModal from '../../components/Modals/ConfirmModal'
import useAuth from '../../hooks/useAuth'
import { useGetAppliedJobs } from '../../hooks/user'
import ProfileCard from '../ProfilesList/ProfileCard'
import '../ProfilesList/style.css'
import '../ProfilesList/ProfileCard/style.css'

// Component that renders the page to see a job details or apply to it
function JobDetails() {
  const params = useParams()
  const navigate = useNavigate()

  const { userId } = useAuth()
  const { applyToJob } = useJobRoutes()
  const { job, user, userId: jobUserId, profiles } = useGetJobById(params.id)

  const { appliedJobs } = useGetAppliedJobs(userId)

  const [modalOpened, setModalOpened] = useState(false)
  const [errorModalOpened, setErrorModalOpened] = useState(false)

  const isJobApplied = useMemo(
    () =>
      appliedJobs.filter(({ jobId }) => jobId === parseInt(params.id, 10))
        .length > 0,
    [appliedJobs, params]
  )

  const isOwnJob = useMemo(
    () => jobUserId && userId === jobUserId,
    [userId, jobUserId]
  )

  const onApplyToJob = async () => {
    await applyToJob(parseInt(params.id, 10), parseInt(userId, 10)).then(
      ({ error: hasError, emptyProfile }) => {
        if (!hasError) navigate('/minhasvagas')
        else {
          setModalOpened(false)
          if (emptyProfile) setErrorModalOpened(true)
        }
      }
    )
  }

  const renderDetailItem = (
    title,
    description,
    className = 'side-detail-item',
    descriptionSize = 16
  ) => (
    <div className={className}>
      <Text className="is-bold" text={title} size={18} />
      <Text text={description} size={descriptionSize} />
    </div>
  )

  const getBtnJobTranslation = () => {
    if (isOwnJob) return 'is_own_job'
    return isJobApplied ? 'job_applied' : 'apply_to_job'
  }

  return (
    <Layout isFinalPage>
      <ConfirmModal
        title="Aplicar para Vaga"
        description={`Deseja realmente aplicar para a vaga "${
          job && job.title
        }"?`}
        onConfirm={() => onApplyToJob()}
        onCancel={() => setModalOpened(false)}
        opened={modalOpened}
      />
      <ConfirmModal
        title="Erro na aplicação de vaga"
        description="Para aplicar para qualquer vaga, é necessário ter um perfil. Deseja ir para a página de criar perfil?"
        onConfirm={() => navigate('/editardados')}
        onCancel={() => setErrorModalOpened(false)}
        opened={errorModalOpened}
      />
      <div className="job-details">
        <div className="card detail-card">
          {job && user ? (
            <>
              {console.log(profiles)}
              <div className="detail-top-container">
                <div>
                  <Text
                    className="is-blue is-bold"
                    text={job.title}
                    size={24}
                  />
                </div>
                <div className="description-top-container">
                  <div className="detail-menu">
                    {renderDetailItem(
                      'Período da Candidatura',
                      `${localDate(job.createdAt)} - ${localDate(
                        job.endingDate
                      )}`
                    )}
                    {renderDetailItem(
                      'Início do Trabalho',
                      `${localDate(job.startingDate)}`
                    )}
                    {renderDetailItem(
                      'Tipo de Vaga',
                      `${jobTypeLabel[job.type]}`
                    )}
                    {renderDetailItem('Carga horária', `${job.workload} horas`)}
                    {renderDetailItem(
                      filterLabel.salary,
                      `${numberToReais(job.salary)}`
                    )}
                    {renderDetailItem('Localidade', `${job.site}`)}
                    {renderDetailItem(
                      'Escolaridade',
                      `${scholarityLabel[job.scholarity]}`,
                      ''
                    )}
                  </div>
                  <div className="job-description">
                    <Text
                      className="is-blue is-bold"
                      text="Descrição da vaga"
                      size={20}
                    />
                    <Text
                      className="description-container"
                      text={job.description}
                      size={18}
                    />
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <Text className="is-blue is-bold" text="Contato" size={20} />
                </div>
                <div className="bottom-details">
                  {renderDetailItem(
                    'Nome do responsável pela vaga',
                    user.name,
                    'bottom-detail-item',
                    18
                  )}
                  {renderDetailItem('E-mail', user.email, '', 18)}
                  <div className="btn-apply-container">
                    <ButtonRectangle
                      className="is-green"
                      label={translate(getBtnJobTranslation())}
                      onClick={() => setModalOpened(true)}
                      disabled={isOwnJob || isJobApplied}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Text
              className="is-bold is-blue"
              text={
                params.id
                  ? 'Carregando detalhes da vaga...'
                  : 'Essa vaga não existe!'
              }
              size={24}
            />
          )}
        </div>
      </div>
      <section id="main">
        <div id="label">
          <span>Perfis recomendados</span>
        </div>

        <div id="profiles">
          <div className="wrap">
            {profiles?.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default JobDetails
