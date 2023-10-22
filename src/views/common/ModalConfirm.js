// ** States
import {useEffect, useState} from "react";
import {MODE_APPROVAL, MODE_DELETE, MODE_LOCK, MODE_REJECT, MODE_UNLOCK, SUCCESS} from "../../configs/constant";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};


export const ModalConfirm = ({isVisible, entityName, mode, onCancel, onSuccess}) => {
  const [action, setAction] = useState('')
  useEffect(() => {
    if (!isVisible) {
      return;
    }
    if (mode === MODE_DELETE) {
      setAction('xóa')

     return
    }
    if (mode === MODE_LOCK) {
      setAction('khóa hoạt động')

      return
    }

    if (mode === MODE_UNLOCK) {
      setAction('mở hoạt động')
    }

    if (mode === MODE_APPROVAL) {
      setAction('phê duyệt')
    }

    if (mode === MODE_REJECT) {
      setAction('từ chối')
    }
  }, [isVisible])

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
            <CardHeader title={`Xác nhận ${action} ${entityName}`}/>
            <CardContent>
             Bạn có chắc chắn muốn {action} {entityName} này không?
            </CardContent>
            <CardActions>
              <Grid item xs={12} display='flex' justifyContent="flex-end">
                <Button variant='outlined' color='secondary' sx={{marginRight: 3.5}} onClick={onCancel}>
                  Hủy
                </Button>
                <Button variant='contained' color='error' onClick={() => onSuccess()}>
                  Xác nhận
                </Button>
              </Grid>
            </CardActions>
          </Card>
        </form>
      </Box>
    </Modal>
  )
}
