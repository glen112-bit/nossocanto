// import * as React from 'react';
// import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
// import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';


export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#eeeee4',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));
