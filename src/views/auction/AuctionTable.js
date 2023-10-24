// ** React Imports
import {useEffect, useState} from 'react'

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
import {MODE_APPROVAL, MODE_LOCK, MODE_REJECT, MODE_UNLOCK, SUCCESS} from "../../configs/constant";
import CheckCircleOutlineIcon from 'mdi-material-ui/CheckCircleOutline';
import Cancel from 'mdi-material-ui/Cancel';
import {ModalConfirm} from "../common/ModalConfirm";
import {showError, showSuccess} from "../../@core/utils/message";
import CardHeader from "@mui/material/CardHeader";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Magnify from "mdi-material-ui/Magnify";
import {debounce} from "@mui/material";
import {apiAuction} from "../../api/api-auction";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";

const AuctionTable = ({id, setId, reload, setReload}) => {
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
    {id: 'userCode', label: 'Mã', minWidth: 100},
    {id: 'username', label: 'Tên đăng nhập', minWidth: 100},
    {
      id: 'productCode',
      label: 'Mã sản phẩm',
      minWidth: 170,
    },
    {
      id: 'productName',
      label: 'Tên sản phẩm',
      minWidth: 170,
    },
    {
      id: 'statusAsText',
      label: 'Trạng thái',
      minWidth: 170,
    },
    {
      id: 'id', label: 'Hành động', minWidth: 100,
      format: (row) => row.status !== 'APPROVED' && (
        <>
          {row.status === 'PENDING' && (
            <Tooltip arrow title={'Từ chối'} placement='top'>
              <Cancel color='error'
                      onClick={() => {
                        setId(row.id)
                        setMode(MODE_REJECT)
                        setVisibleModalConfirm(true)
                      }}
              />
            </Tooltip>
          )}

          {row.status === 'PENDING' &&  (
            <Tooltip arrow title={'Phê duyệt'} placement='top'>
              <CheckCircleOutlineIcon color='success'
                                      onClick={() => {
                                        setId(row.id)
                                        setMode(MODE_APPROVAL)
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
    if (mode === MODE_REJECT) {
      res = await apiAuction.reject(id);
    }
    if (mode === MODE_APPROVAL) {
      res = await apiAuction.confirm(id);
    }
    if (res?.code === SUCCESS) {
      showSuccess(`${mode === MODE_UNLOCK ? 'Phê duyệt' : 'Từ chối'} yêu cầu thành công`)
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

    const res = await apiAuction.doSearch({
      page, size, keyword,
      fromDateAuction: fromDate ? fromDate.getTime() : null,
      toDateAuction: toDate ? toDate.getTime() : null
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
                      entityName={'yêu cầu'}
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

export default AuctionTable
