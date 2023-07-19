import Header from "./Header"
import Main from "./Main"

function ForProtectedRoute({ userEmail, ...props }) {
    return(
        <>
          <Header dataUser={userEmail} />
          <Main
            name='main'
            {...props}
           />
        </>

    )
}

export default ForProtectedRoute;