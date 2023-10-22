// ** MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

// ** Layout Imports
// !Do not remove this Layout import
import VerticalLayout from 'src/@core/layouts/VerticalLayout'

// ** Navigation Imports
import VerticalNavItems from 'src/navigation/vertical'

// ** Component Import
// import UpgradeToProButton from './components/UpgradeToProButton'
import VerticalAppBarContent from './components/vertical/AppBarContent'

// ** Hook Import
import {useSettings} from 'src/@core/hooks/useSettings'
import {useEffect, useState} from 'react';
import {ACCESS_TOKEN, SUCCESS, USER_INFO} from '../configs/constant'
import {useRouter} from 'next/router';
import {apiUser} from '../api/api-user';

const UserLayout = ({ children }) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings()
  const router = useRouter()

  const [user, setUser] = useState({})

  useEffect(async () => {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
      localStorage.clear()
      router.push('/pages/login')

      return
    }

    if (localStorage.getItem(USER_INFO)) {
      setUser(JSON.parse(localStorage.getItem(USER_INFO)))

      return
    }

    const res = await apiUser.getInfo()
    console.log(res);
    if (res?.code === SUCCESS) {
      localStorage.setItem(USER_INFO, JSON.stringify(res.data))
      setUser(res.data)

      return
    }

    localStorage.clear()
    router.push('/pages/login')
  }, [])



  /**
   *  The below variable will hide the current layout menu at given screen size.
   *  The menu will be accessible from the Hamburger icon only (Vertical Overlay Menu).
   *  You can change the screen size from which you want to hide the current layout menu.
   *  Please refer useMediaQuery() hook: https://mui.com/components/use-media-query/,
   *  to know more about what values can be passed to this hook.
   *  ! Do not change this value unless you know what you are doing. It can break the template.
   */
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))

  return (
      <VerticalLayout
        hidden={hidden}
        settings={settings}
        saveSettings={saveSettings}
        verticalNavItems={VerticalNavItems()} // Navigation Items
        // afterVerticalNavMenuContent={UpgradeToProImg}
        verticalAppBarContent={(
          props // AppBar Content
        ) => (
          <VerticalAppBarContent
            hidden={hidden}
            user={user}
            settings={settings}
            saveSettings={saveSettings}
            toggleNavVisibility={props.toggleNavVisibility}
          />
        )}
      >
        {/*<LocalizationProvider dateAdapter={AdapterDayjs}>*/}
        {children}
        {/*<UpgradeToProButton />*/}
        {/*</LocalizationProvider>*/}
      </VerticalLayout>
  )
}

export default UserLayout
