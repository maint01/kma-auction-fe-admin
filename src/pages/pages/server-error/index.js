// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Component Import
import Error500 from 'src/pages/500'

const ServerErrorPage = () => <Error500 />
ServerErrorPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default ServerErrorPage
