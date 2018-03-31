const initialState = {
  projects: []
}

const reducer = (state = initialState, action) => {
  switch(action.type){
    case 'page_load': {
      return{
          projects: action.payload
        }
    }
    default: {
      return initialState
    }
  }
}

export default reducer;