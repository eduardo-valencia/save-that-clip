import { Box, BoxProps } from '@mui/material'

export default function PageContainer({ sx, ...other }: BoxProps) {
  return <Box sx={{ px: '1.5rem', py: '2.1875rem', ...sx }} {...other} />
}
