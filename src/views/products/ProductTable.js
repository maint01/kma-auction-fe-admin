// ** React Imports
import {useEffect, useImperativeHandle, useState} from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Tooltip from '@mui/material/Tooltip'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import {apiUser} from "../../api/api-user";
import {MODE_APPROVAL, MODE_DELETE, MODE_LOCK, MODE_REJECT, MODE_UNLOCK, SUCCESS} from "../../configs/constant";
import DeleteOutline from "mdi-material-ui/DeleteOutline";
import AccountCheckOutline from "mdi-material-ui/AccountCheckOutline";
import PencilOutline from "mdi-material-ui/PencilOutline";
import {ModalConfirm} from "../common/ModalConfirm";
import {showSuccess} from "../../@core/utils/message";
import CardHeader from "@mui/material/CardHeader";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Magnify from "mdi-material-ui/Magnify";
import {debounce} from "@mui/material";
import {apiProduct} from "../../api/api-product";
import moment from "moment";
import {numberWithCommas} from "../../@core/utils/fn-common";
import Cancel from "mdi-material-ui/Cancel";
import CheckCircleOutlineIcon from "mdi-material-ui/CheckCircleOutline";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";

const ProductTable = ({id, setId, setIsVisible, reload, setReload}) => {
  // ** States
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [keyword, setKeyword] = useState('')
  const [totalRecord, setTotalRecord] = useState(0)
  const [dataSource, setDataSource] = useState([])

  const [mode, setMode] = useState('')
  const [visibleModalConfirm, setVisibleModalConfirm] = useState(false)

  const columns = [
    {
      id: 'index',
      label: '#',
      minWidth: 30,
    },
    {
      id: 'name',
      label: 'Tên',
      minWidth: 170,
    },
    {id: 'code', label: 'Mã', minWidth: 100},
    {id: 'type', label: 'Loại', minWidth: 100},
    {id: 'minPrice', label: 'Giá khởi điểm', minWidth: 100, format: (row) => <>{numberWithCommas(row.minPrice)}</>},
    {id: 'stepFee', label: 'Bước giá', minWidth: 100, format: (row) => <>{numberWithCommas(row.stepFee)}</>},
    {id: 'imageUrl', label: 'Hình ảnh', minWidth: 100, format: (row) => <><img style={{with: '100px', height: '80px'}} src={row.imageUrl} alt="Product image"/></>},
    {id: 'registrationStartTime', label: 'Ngày hiệu lực', minWidth: 100, format: (row) => moment(row.registrationStartTime).format('DD/MM/YYYY HH:mm:ss')},
    {id: 'registrationEndTime', label: 'Ngày hiệu lực', minWidth: 100, format: (row) => moment(row.registrationEndTime).format('DD/MM/YYYY HH:mm:ss')},
    {id: 'activeTime', label: 'Ngày hiệu lực', minWidth: 100, format: (row) => moment(row.activeTime).format('DD/MM/YYYY HH:mm:ss')},
    {id: 'expireTime', label: 'Ngày hết hiệu lực', minWidth: 100, format: (row) => moment(row.expireTime).format('DD/MM/YYYY HH:mm:ss')},
    {id: 'description', label: 'Mô tả', minWidth: 170},
    {id: 'statusAsText', label: 'Trạng thái', minWidth: 100},
    {
      id: 'id', label: 'Hành động', minWidth: 150,
      format: (row) => (
        <>
          <Tooltip arrow title={'Chỉnh sửa'} placement='top'>
            <PencilOutline color='primary'
                           onClick={() => {
                             setId(row.id)
                             setIsVisible(true)
                           }}
            />
          </Tooltip>
          {row.status === 'PENDING' && (
            <Tooltip arrow title={'Đóng hoạt động'} placement='top'>
              <CheckCircleOutlineIcon color='success'
                                      onClick={() => {
                                        setId(row.id)
                                        setMode(MODE_LOCK)
                                        setVisibleModalConfirm(true)
                                      }}
              />
            </Tooltip>
          )}
          {row.status === 'PENDING' && (
            <Tooltip arrow title={'Mở hoạt động'} placement='top'>
              <Cancel color='error'
                      onClick={() => {
                        setId(row.id)
                        setMode(MODE_UNLOCK)
                        setVisibleModalConfirm(true)
                      }}
              />
            </Tooltip>
          )}
          {['PENDING', 'INACTIVE'].includes(row.status) && (
            <Tooltip arrow title={'Xóa'} placement='top'>
              <DeleteOutline color='error'
                      onClick={() => {
                        setId(row.id)
                        setMode(MODE_DELETE)
                        setVisibleModalConfirm(true)
                      }}
              />
            </Tooltip>
          )}


        </>
      )
    },
  ]

  useEffect(async () => {
    await doSearch()
  }, [page, size])

  useEffect(() => {
    if (page !== 0) {
      setPage(0)
    } else {
      doSearch()
    }
  }, [reload, keyword, fromDate, toDate])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setSize(+event.target.value)
    setPage(0)
  }

  const handleConfirmed = async () => {
    let res;
    if (mode === MODE_LOCK) {
      res = await apiProduct.inactive(id);
    }
    if (mode === MODE_UNLOCK) {
      res = await apiProduct.active(id);
    }

    if (mode === MODE_DELETE) {
      res = await apiProduct.delete(id);
    }
    if (res?.code === SUCCESS) {
      showSuccess(`${mode === MODE_DELETE ? 'Xóa' : (mode === MODE_UNLOCK ? 'Khóa hoạt động' : 'Mở hoạt động')} sản phẩm thành công`)
      setId(null)
      setMode('')
      setVisibleModalConfirm(false)
      setReload(Math.random())
    } else {
      showError(res?.data?.error)
    }

  }

  const handleChange = event => {
    setKeyword(event.target.value)
  }

  const doSearch = async () => {
    setDataSource([])

    const res = await apiProduct.doSearch({
      page, size, keyword,
      fromDateProduct: fromDate ? fromDate.getTime() : null,
      toDateProduct: toDate ? toDate.getTime() : null
    });
    if (res?.code === SUCCESS) {
      const data = res.data.content.map((item, index) => {
        return {...item, index: page * size + index + 1}
      });
      setDataSource(data);
      setTotalRecord(res.data.totalElements);
    }
  }

  return (
    <>
      <Card>
        <CardHeader title={
          <>
            <Grid container spacing={6}>
              <Grid item xs={12} display="flex" justifyContent="flex-end">
                <Box className='actions-left' sx={{mr: 2, display: 'flex', alignItems: 'center'}}>
                  <DateTimePicker
                    slotProps={{ textField: { size: 'small' } }}
                    required
                    fullWidth
                    format={'dd/MM/yyyy hh:mm aa'}
                    style={{with: '100%'}}
                    id='fromDate'
                    label='Từ ngày'
                    toolbarPlaceholder='Chọn từ ngày'
                    value={fromDate}
                    onChange={(date) => setFromDate(date)} >
                  </DateTimePicker>
                </Box>
                <Box className='actions-left' sx={{mr: 2, display: 'flex', alignItems: 'center'}}>
                  <DateTimePicker
                    slotProps={{ textField: { size: 'small' } }}
                    required
                    fullWidth
                    format={'dd/MM/yyyy hh:mm aa'}
                    style={{with: '100%'}}
                    id='toDate'
                    label='Đến ngày'
                    toolbarPlaceholder='Chọn đến ngày'
                    value={toDate}
                    onChange={(date) => setToDate(date)} >
                  </DateTimePicker>
                </Box>
                <Box className='actions-left' sx={{mr: 2, display: 'flex', alignItems: 'center'}}>
                  <TextField
                    size='small'
                    placeholder={'Nhập từ khóa'}
                    sx={{'& .MuiOutlinedInput-root': {borderRadius: 4}}}
                    onChange={debounce(handleChange, 500)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Magnify fontSize='small'/>
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </>

        }
                    titleTypographyProps={{variant: 'h6'}}/>
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
          <TableContainer sx={{maxHeight: 440}}>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  {columns.map(column => (
                    <TableCell key={column.id} align={column.align} sx={{minWidth: column.minWidth}}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {dataSource.map((row, index) => {
                  return (
                    <TableRow hover role='checkbox' tabIndex={-1} key={row.index}>
                      {columns.map(column => {
                        const value = row[column.id]

                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format ? column.format(row) : value}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component='div'
            count={totalRecord}
            rowsPerPage={size}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <ModalConfirm isVisible={visibleModalConfirm}
                      mode={mode}
                      entityName={'sản phẩm'}
                      onCancel={() => {
                        setVisibleModalConfirm(false)
                      }}
                      onSuccess={() => {
                        handleConfirmed()
                      }}
        />
      </Card>
    </>
  )
}

export default ProductTable
