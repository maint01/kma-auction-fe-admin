// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import Gavel from 'mdi-material-ui/Gavel'
import Cast from 'mdi-material-ui/Cast'
import History from 'mdi-material-ui/History'

const navigation = () => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/'
    },
    {
      title: 'Người dùng',
      icon: AccountCogOutline,
      path: '/users'
    },
    {
      title: 'Sản phẩm',
      icon: Cast,
      path: '/products'
    },
    {
      title: 'Yêu cầu đấu giá',
      icon: Gavel,
      path: '/auction'
    },
    {
      title: 'Lịch sử đấu giá',
      icon: History,
      path: '/auction-history'
    }
  ]
}

export default navigation
