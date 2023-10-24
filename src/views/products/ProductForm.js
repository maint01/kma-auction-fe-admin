// ** React Imports
import {useEffect, useState} from 'react'

// ** MUI Imports
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Modal from '@mui/material/Modal'
import {SUCCESS} from "../../configs/constant";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {showError, showSuccess} from "../../@core/utils/message";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import {apiProduct} from "../../api/api-product";

import moment from 'moment'
import {Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";


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

const ProductForm = ({id, isVisible, onSuccess, onCancel}) => {
  // ** States
  const [values, setValues] = useState({
    code: '',
    name: '',
    type: '',
    description: '',
    minPrice: '',
    stepFee: '',
    registrationStartTime: null,
    registrationEndTime: null,
    activeTime: null,
    expireTime: null,
  })
  const [file, setFile] = useState('')
  const [types, setTypes] = useState([])
  const [imageUrl, setImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)


  useEffect(async () => {
    if (!isVisible ) {
      return;
    }
    await loadProductType()
    if (!id) {
      return
    }

   await loadDetail()
  }, [isVisible])

  const handleChange = prop => event => {
    setValues({...values, [prop]: event.target.value})
  }

  const handleDateChange = prop => value => {
    setValues({...values, [prop]: value})
  }

  const handleUploadChange = ({target}) => {
    const fileReader = new FileReader();

    fileReader.readAsDataURL(target.files[0])
    fileReader.onload = (e) => {
      setImageUrl(e.target.result)
    };
    setFile(target.files[0])
  }

  const resetForm = () => {
    setValues({
      code: '',
      name: '',
      description: '',
      minPrice: '',
      stepFee: '',
      activeTime: null,
      expireTime: null,
    })
    setImageUrl('')
    setFile(null)
  }

  const loadDetail = async () => {
    const res = await apiProduct.getDetail(id)
    if (res?.code === SUCCESS) {
      const product = res.data;
      product.activeTime = product.activeTime ? moment(product.activeTime).toDate() : null
      product.expireTime = product.expireTime ? moment(product.expireTime).toDate() : null
      product.registrationStartTime =  product.registrationStartTime ? moment(product.registrationStartTime).toDate() : null
      product.registrationEndTime = product.registrationEndTime ? moment(product.registrationEndTime).toDate() : null
      setImageUrl(product.imageUrl)
      setValues(product)

      return
    }
    showError(res?.data?.error)
  }


  const loadProductType = async () => {
    const res = await apiProduct.getTypes()
    setTypes(res)
  }

  const onSave = async () => {
    if (isLoading) {
      return;
    }
    const data = {...values, file}
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    let res;
    if (id) {
      data.id = id
    }
    data.activeTime = moment(data.activeTime).format('YYYY-MM-DD[T]HH:mm:ss')
    data.expireTime = moment(data.expireTime).format('YYYY-MM-DD[T]HH:mm:ss')
    data.registrationStartTime = moment(data.registrationStartTime).format('YYYY-MM-DD[T]HH:mm:ss')
    data.registrationEndTime = moment(data.registrationEndTime).format('YYYY-MM-DD[T]HH:mm:ss')
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }
    setIsLoading(true)
    if (id) {
      data.id = id
      res = await apiProduct.update(data.id, data)
    } else {
      res = await apiProduct.create(formData)
    }

    setIsLoading(false)
    if (res?.data?.code === SUCCESS) {
      showSuccess(`${id ? 'Cập nhât' : 'Tạo mới'} sản phẩm thành công`)
      resetForm()
      onSuccess()

      return;
    }
    const error = res?.data;
    if (error && error[0]) {
      res?.data?.data?.forEach((error) => showError(error.error))
    } else {
      showError(error.error)
    }

  }

  return (
    <Modal
      open={isVisible}
      onClose={onCancel}
      aria-labelledby="keep-modal-title"
      aria-describedby="keep-modal-description"
    >
      {/*<LocalizationProvider dateAdapter={AdapterDateFns}>*/}
      <Box sx={style}>
        <form onSubmit={e => {
          e.preventDefault()
        }}>
          <Card>
            <CardHeader title={`${id ? 'Cập nhật' : 'Tạo mới'} sản phẩm`}/>
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label='Mã'
                    placeholder='Nhập mã'
                    id='code'
                    value={values.code}
                    onChange={handleChange('code')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label='Tên'
                    placeholder='Nhập tên'
                    id='name'
                    value={values.name}
                    onChange={handleChange('name')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    select={true}
                    fullWidth
                    labelId="type"
                    label='Loại sản phẩm'
                    id='type'
                    value={values.type}
                    onChange={handleChange('type')}
                  >
                    {types && types.map(productType => (<MenuItem key={productType.code} value={productType.code}>{productType.name}</MenuItem>))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    multiline={true}
                    rows={3}
                    fullWidth
                    label='Mô tả'
                    placeholder='Nhập mô tả'
                    id='description'
                    value={values.description}
                    onChange={handleChange('description')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    aria-errormessage={'dsadsa'}
                    fullWidth
                    id='minPrice'
                    label='Giá khởi điểm'
                    placeholder='Nhập giá khởi điểm'
                    value={values.minPrice}
                    onChange={handleChange('minPrice')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id='stepFee'
                    label='Bước giá'
                    placeholder='Bước giá'
                    value={values.stepFee}
                    onChange={handleChange('stepFee')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DateTimePicker
                    required
                    fullWidth
                    format={'dd/MM/yyyy hh:mm aa'}
                    style={{with: '100%'}}
                    id='registrationStartTime'
                    label='Ngày mở đăng ký'
                    toolbarPlaceholder='Chọn ngày mở đăng ký'
                    value={values.registrationStartTime}
                    onChange={handleDateChange('registrationStartTime')} >
                  </DateTimePicker>
                </Grid>

                <Grid item xs={6}>
                  <DateTimePicker
                    required
                    fullWidth
                    minDate={values.registrationStartTime}
                    format={'dd/MM/yyyy hh:mm aa'}
                    style={{with: '100%'}}
                    id='registrationEndTime'
                    label='Ngày đóng đăng ký'
                    toolbarPlaceholder='Chọn
                   Ngày đóng đăng ký ngày đóng đăng ký'
                    value={values.registrationEndTime}
                    onChange={handleDateChange('registrationEndTime')} >
                  </DateTimePicker>
                </Grid>
                <Grid item xs={6}>
                  <DateTimePicker
                    format={'dd/MM/yyyy hh:mm aa'}
                    id='activeTime'
                    label='Ngày hiệu lực'
                    toolbarPlaceholder='Chọn ngày hiệu lực'
                    value={values.activeTime}
                    onChange={handleDateChange('activeTime')} >
                  </DateTimePicker>
                </Grid>

                <Grid item xs={6}>
                  <DateTimePicker
                    required
                    fullWidth
                    minDate={values.activeTime}
                    format={'dd/MM/yyyy hh:mm aa'}
                    style={{with: '100%'}}
                    id='expireTime'
                    label='Ngày hết hiệu lực'
                    toolbarPlaceholder='Chọn ngày hết hiệu lực'
                    value={values.expireTime}
                    onChange={handleDateChange('expireTime')} >
                  </DateTimePicker>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    component="label"
                  >
                    Chọn ảnh
                    <input
                      type="file"
                      accept="image/png, image/gif, image/jpeg"
                      hidden
                      onChange={handleUploadChange}
                    />
                  </Button>
                </Grid>
                {imageUrl && (
                  <Grid item xs={12}>
                    <img style={{with: '160px', height: '130px'}} src={imageUrl} alt="Product image"/>
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
      {/*</LocalizationProvider>*/}
    </Modal>
  )
}

export default ProductForm
