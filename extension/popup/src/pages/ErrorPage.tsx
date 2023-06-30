import { Typography } from '@mui/material'
import PageContainer from '../components/PageContainer'

const ErrorPage = () => {
  return (
    <PageContainer>
      <Typography variant='h1'>There was an unexpected error.</Typography>
      <Typography>Please try again later.</Typography>
    </PageContainer>
  )
}

export default ErrorPage
