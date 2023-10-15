// ** React Imports
import {useEffect, useState} from 'react'

// ** MUI Imports
import Modal from '@mui/material/Modal'
import {apiUser} from "../../api/api-user";
import {SUCCESS} from "../../configs/constant";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import AccountOutline from "mdi-material-ui/AccountOutline";
import EmailOutline from "mdi-material-ui/EmailOutline";
import Phone from "mdi-material-ui/Phone";
import FormTextboxPassword from "mdi-material-ui/FormTextboxPassword";
import {showError, showSuccess} from "../../@core/utils/message";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 0,
  borderRadius: '5px'
};

const UserForm = ({id, isVisible, onSuccess, onCancel}) => {
  // ** States
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
    if (!isVisible || !id) {
      return;
    }
    loadDetail()
  }, [isVisible])

  const handleChange = prop => event => {
    setValues({...values, [prop]: event.target.value})
  }

  const resetForm = () => {
    setValues({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phone: '',
      password: ''
    })
  }

  const loadDetail = async () => {
    const res = await apiUser.getDetail(id)
    if (res.code === SUCCESS) {
      setValues(res.data)

      return
    }
    showError(res?.data?.error)
  }

  const onSave = async () => {
    if (isLoading) {
      return;
    }
    const data = {...values}
    let res;
    setIsLoading(true)
    if (id) {
      data.id = id
      res = await apiUser.update(data)
    } else {
      res = await apiUser.create(data)
    }
    setIsLoading(false)
    if (res.code === SUCCESS) {
      showSuccess(`${id ? 'Cập nhât' : 'Tạo mới'} thành công`)
      resetForm()
      onSuccess()

      return;
    }

    showError(res?.data?.error)
  }

  return (
    <Modal
      open={isVisible}
      onClose={onCancel}
      aria-labelledby="keep-modal-title"
      aria-describedby="keep-modal-description"
    >
      <Box sx={style}>
        <form onSubmit={e => {
          e.preventDefault()
        }}>
          <Card>
            <CardHeader title={`${id ? 'Cập nhật' : 'Tạo mới'} người dùng`}/>
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Họ'
                    placeholder='Họ'
                    id='firstName'
                    value={values.firstName}
                    onChange={handleChange('firstName')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <AccountOutline/>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Tên'
                    placeholder='Tên'
                    id='lastName'
                    value={values.lastName}
                    onChange={handleChange('lastName')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <AccountOutline/>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Tên đăng nhập'
                    placeholder='Tên đăng nhập'
                    disabled={id}
                    id='username'
                    value={values.username}
                    onChange={handleChange('username')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <AccountOutline/>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id='email'
                    type='email'
                    label='Email'
                    placeholder='carterleonard@gmail.com'
                    value={values.email}
                    onChange={handleChange('email')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <EmailOutline/>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id='phone'
                    label='Số điện thoại'
                    placeholder='+1-123-456-8790'
                    value={values.phone}
                    onChange={handleChange('phone')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Phone/>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id='password'
                    type='password'
                    label='Mật khẩu'
                    placeholder='*****'
                    value={values.password}
                    onChange={handleChange('password')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <FormTextboxPassword/>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Grid item xs={12} display='flex' justifyContent="flex-end">
                <Button type='reset' variant='outlined' color='secondary' sx={{marginRight: 3.5}} onClick={onCancel}>
                  Cancel
                </Button>
                <Button variant='contained' onClick={() => onSave()} disabled={isLoading}>
                  Save
                </Button>
              </Grid>
            </CardActions>
          </Card>
        </form>
      </Box>
    </Modal>
  )
}

export default UserForm
