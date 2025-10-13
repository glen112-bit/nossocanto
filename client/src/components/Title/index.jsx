import * as React from "react"
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
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


const Title = ({title}) => {
    return(
        <>
            <Stack spacing = {2}>
                <Item>
                    {title} 
                </Item>
            </Stack>
        </>
    )
}
export default Title 

