// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

// ** Demo Components Imports
import CardContent from "@mui/material/CardContent";
import {useState} from "react";
import AuctionTable from "../../views/auction/AuctionTable";

const AuctionPage = () => {
  const [reload, setReload] = useState('');
  const [id, setId] = useState(false);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card key={1}>
          <CardContent>
            <Grid container spacing={6}>
              <Grid item md={6}>
                <Typography variant='h5'>
                  <Link>
                    Yêu cầu đầu giá
                  </Link>
                </Typography>
                <Typography variant='body2'>Quản trị yêu cầu đấu giá</Typography>
              </Grid>
            </Grid>
          </CardContent>

        </Card>
      </Grid>


      <Grid item xs={12}>
        <AuctionTable key={221321}
                   id={id}
                   setId={setId}
                   reload={reload}
                   setReload={setReload}
        />
      </Grid>
    </Grid>
  )
}

export default AuctionPage
