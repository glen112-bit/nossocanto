import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

export const Item = styled(Paper)(({theme  }) => ({
  backgroundColor: '#3794bf',
  ...theme.typography.body2,
  padding: theme.spacing(5),
  textAlign: 'center',
  color: theme.palette.text.primary,
    fontSize: 46,
    fontWeight: 800,
    fontFamily:  "Barlow" ,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));
