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
import {validations} from "../../@core/utils/utils-validation";

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

  const [firstName, setFirstName] = useState({value: '', error: false, help: ''})
  const [lastName, setLastName] = useState({value: '', error: false, help: ''})
  const [username, setUsername] = useState({value: '', error: false, help: ''})
  const [email, setEmail] = useState({value: '', error: false, help: ''})
  const [phone, setPhone] = useState({value: '', error: false, help: ''})
  const [password, setPassword] = useState({value: '', error: false, help: ''})
  const [isLoading, setIsLoading] = useState(false)

  const validateFirstNameField = (target) => {
    return validations(target, setFirstName, "Họ", {
      isRequired: true,
      maxLength: 100,
    });
  };

  const validateLastNameField = (target) => {
    return validations(target, setLastName, "Họ", {
      isRequired: true,
      maxLength: 100,
    });
  };

  const validateUsernameField = (target) => {
    return validations(target, setUsername, "Tên đăng nhập", {
      isRequired: true,
      maxLength: 100,
    });
  };

  const validateEmailField = (target) => {
    return validations(target, setEmail, "Email", {
      isRequired: true,
      isMail: true,
      maxLength: 100,
    });
  };

  const validatePhoneField = (target) => {
    return validations(target, setPhone, "Số điện thoại", {
      isRequired: true,
      isPhone: true,
      maxLength: 16,
    });
  };

  const validatePasswordField = (target) => {
    return validations(target, setPassword, "Mật khẩu", {
      isRequired: true,
      maxLength: 100,
    });
  };

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
    setFirstName({value: '', error: false, help: ''})
    setLastName({value: '', error: false, help: ''})
    setUsername({value: '', error: false, help: ''})
    setEmail({value: '', error: false, help: ''})
    setPhone({value: '', error: false, help: ''})
    setPassword({value: '', error: false, help: ''})
  }

  const loadDetail = async () => {
    const res = await apiUser.getDetail(id)
    if (res?.code === SUCCESS) {
      setFirstName({value: res.data.firstName, error: false, help: ''})
      setLastName({value: res.data.lastName, error: false, help: ''})
      setUsername({value: res.data.username, error: false, help: ''})
      setEmail({value: res.data.email, error: false, help: ''})
      setPhone({value: res.data.phone, error: false, help: ''})

      return
    }
    showError(res?.data?.error)
  }

  const onSave = async () => {
    if (isLoading) {
      return;
    }
    if (!validateFirstNameField(firstName) ||
      !validateLastNameField(lastName) ||
      !validateUsernameField(username) ||
      !validateEmailField(email) ||
      !validatePhoneField(phone) ||
      !validatePasswordField(password)
    ) {
      return;
    }

    const data = {
      firstName: firstName.value,
      lastName: lastName.value,
      username: username.value,
      email: email.value,
      phone: phone.value,
      password: password.value,
    }
    let res;
    setIsLoading(true)
    if (id) {
      data.id = id
      res = await apiUser.update(data)
    } else {
      res = await apiUser.create(data)
    }
    setIsLoading(false)
    if (res?.code === SUCCESS) {
      showSuccess(`${id ? 'Cập nhât' : 'Tạo mới'} nguười dùng thành công`)
      resetForm()
      onSuccess()

      return;
    }
    const error = res?.data;
    if (error && error[0]) {
      res?.data?.data?.forEach((error) => showError(error.error))
    }
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
                    required
                    fullWidth
                    label='Họ'
                    placeholder='Họ'
                    id='firstName'
                    error={firstName.error}
                    helperText={firstName.help}
                    value={firstName.value}
                    onChange={e => setFirstName({...firstName, value: e.target.value})}
                    onBlur={() => validateFirstNameField(firstName)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label='Tên'
                    placeholder='Tên'
                    id='lastName'
                    error={lastName.error}
                    helperText={lastName.help}
                    value={lastName.value}
                    onChange={e => setLastName({...lastName, value: e.target.value})}
                    onBlur={() => validateLastNameField(lastName)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label='Tên đăng nhập'
                    placeholder='Tên đăng nhập'
                    disabled={id}
                    id='username'
                    error={username.error}
                    helperText={username.help}
                    value={username.value}
                    onChange={e => setUsername({...username, value: e.target.value})}
                    onBlur={() => validateUsernameField(username)}

                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id='email'
                    label='Email'
                    error={email.error}
                    helperText={email.help}
                    value={email.value}
                    onChange={e => setEmail({...email, value: e.target.value})}
                    onBlur={() => validateEmailField(email)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    placeholder='098....'
                    label='Số điện thoại'
                    id='phone'
                    error={phone.error}
                    helperText={phone.help}
                    value={phone.value}
                    onChange={e => setPhone({...phone, value: e.target.value})}
                    onBlur={() => validatePhoneField(phone)}
                  />
                </Grid>
                {!id && (
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id='password'
                      type='password'
                      label='Mật khẩu'
                      placeholder='*****'
                      error={password.error}
                      helperText={password.help}
                      value={password.value}
                      onChange={e => setPassword({...password, value: e.target.value})}
                      onBlur={() => validatePasswordField(password)}
                    />
                  </Grid>
                )}
              </Grid>
            </CardContent>
            <CardActions>
              <Grid item xs={12} display='flex' justifyContent="flex-end">
                <Button type='reset' variant='outlined' color='secondary' sx={{marginRight: 3.5}} onClick={() => {
                  resetForm()
                  onCancel()
                }}>
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
