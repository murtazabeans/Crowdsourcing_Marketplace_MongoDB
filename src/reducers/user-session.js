const initialState = {
  isLoggedIn: false,
  login_data: null
}

const reducer = (state = initialState, action) => {
  switch(action.type){
    case 'LoggedIn': {
      return{
          isLoggedIn: true,
          login_data: action.payload
        }
    }
    default: {
      return initialState
    }
  }
}

export default reducer;