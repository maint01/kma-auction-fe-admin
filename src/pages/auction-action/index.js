// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

// ** Demo Components Imports
import CardContent from "@mui/material/CardContent";
import {useState} from "react";
import AuctionActionTable from "../../views/auction-action/AuctionActionTable";
import AuctionActionForm from "../../views/auction-action/AuctionActionForm";

const AuctionPage = () => {
  const [isVisible, setIsVisible] = useState(false);
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
                    Tham gia đấu giá
                  </Link>
                </Typography>
                <Typography variant='body2'>Tham gia đấu giá</Typography>
              </Grid>
            </Grid>
          </CardContent>

        </Card>
      </Grid>


      <Grid item xs={12}>
        <AuctionActionTable key={221321}
                            id={id}
                            setId={setId}
                            setIsVisible={setIsVisible}
                            reload={reload}
                            setReload={setReload}
        />
      </Grid>
    </Grid>
  )
}

export default AuctionPage
