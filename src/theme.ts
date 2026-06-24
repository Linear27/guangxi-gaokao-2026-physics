import { createTheme } from '@mui/material/styles'
import type {} from '@mui/x-data-grid/themeAugmentation'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1f6feb',
    },
    background: {
      default: '#f6f8fb',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily:
      '"Noto Sans SC", "Microsoft YaHei UI", "Microsoft YaHei", system-ui, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.25,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.2rem',
      fontWeight: 700,
      lineHeight: 1.35,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained',
      },
    },
    MuiCard: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiDataGrid: {
      defaultProps: {
        density: 'compact',
        disableRowSelectionOnClick: true,
        pageSizeOptions: [25, 50, 100],
        initialState: {
          pagination: {
            paginationModel: {
              pageSize: 50,
            },
          },
        },
      },
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
        },
      },
    },
  },
})
