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
import {MODE_DELETE, MODE_LOCK, MODE_UNLOCK, SUCCESS} from "../../configs/constant";
import AccountCancelOutline from "mdi-material-ui/AccountCancelOutline";
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

function createData(name, code, population, size) {
  const density = population / size

  return {name, code, population, size, density}
}

const UserTable = ({id, setId, setIsVisible, reload, setReload}) => {
  // ** States
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
      id: 'firstName',
      label: 'Họ tên',
      minWidth: 170,
      format: (row) => row.firstName + ' ' + row.lastName
    },
    {id: 'email', label: 'Email', minWidth: 170},
    {id: 'phone', label: 'Số điện thoại', minWidth: 170},
    {id: 'code', label: 'Code', minWidth: 100},
    {
      id: 'activated', label: 'Trạng thái', minWidth: 100,
      format: (row) => row.activated ?
        <Tooltip arrow title={'Hoạt động'} placement='top'><AccountCheckOutline color='success'/></Tooltip>
        : <Tooltip arrow title={'Khóa'} placement='top'><AccountCancelOutline color='error'/></Tooltip>
    },

    {
      id: 'id', label: 'Hành động', minWidth: 100,
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
          {row.activated && (
            <Tooltip arrow title={'Khóa hoạt động'} placement='top'>
              <AccountCancelOutline color='error'
                                    onClick={() => {
                                      setId(row.id)
                                      setMode(MODE_LOCK)
                                      setVisibleModalConfirm(true)
                                    }}
              />
            </Tooltip>
          )}

          {!row.activated && (
            <Tooltip arrow title={'Mở hoạt động'} placement='top'>
              <AccountCheckOutline color='success'
                                   onClick={() => {
                                     setId(row.id)
                                     setMode(MODE_UNLOCK)
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
  }, [reload, keyword])

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
      res = await apiUser.inactive(id);
    }
    if (mode === MODE_UNLOCK) {
      res = await apiUser.active(id);
    }
    if (res.code === SUCCESS) {
      showSuccess(`${MODE_UNLOCK ? 'Khóa hoạt động' : 'Mở hoạt động'} thành công`)
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
    const res = await apiUser.doSearch({page, size, keyword});
    if (res.code === SUCCESS) {
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
              <Grid item xs={6}>Danh sách người dùng</Grid>
              <Grid item xs={6} display="flex" justifyContent="flex-end">
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
                      entityName={'người dùng'}
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

export default UserTable
