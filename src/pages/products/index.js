// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

// ** Demo Components Imports
import UserTable from "../../views/users/UserTable";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import {useState} from "react";
import ProductTable from "../../views/products/ProductTable";
import ProductForm from "../../views/products/ProductForm";

const ProductPage = () => {
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
                    Sản phẩm
                  </Link>
                </Typography>
                <Typography variant='body2'>Quản trị sản phẩm</Typography>
              </Grid>
              <Grid item md={6} textAlign='right'>
                <Button variant='outlined' color={'success'}
                        onClick={() => setIsVisible(true)} l>Tạo mới</Button>
              </Grid>
            </Grid>
          </CardContent>

        </Card>
      </Grid>


      <Grid item xs={12}>
        <ProductTable key={221321}
                   id={id}
                   setId={setId}
                   setIsVisible={setIsVisible}
                   reload={reload}
                   setReload={setReload}
        />
      </Grid>
      <ProductForm id={id}
                isVisible={isVisible}
                onCancel={() => {
                  setId('')
                  setIsVisible(false)
                }}
                onSuccess={() => {
                  setIsVisible(false)
                  setId(null)
                  setReload(Math.random() + '')
                }}
      />
    </Grid>
  )
}

export default ProductPage
