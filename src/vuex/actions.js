import {USER_ID, IS_AUTH, ERROR_STATE} from './mutation_types'
import loginAPI from '../service/LogInApi'

let setUserId = ({commit}, data) => {
    commit(USER_ID, data)
}

let setErrorState = ({commit},data) => {
    commit(ERROR_STATE, data)
}

let setIsAuth = ({commit},data) =>{
    commit(IS_AUTH,data)
}

let processResponse = (store, loginResponse) => {
    switch (loginResponse) {
        case 'notFound':
            setErrorState(store, 'Wrong ID or Password')
            setIsAuth(store, false)
            break
        default:
            setUserId(store, loginResponse.userId)
            setErrorState(store,'')
            setIsAuth(store,true)
    }
}

export default {
    async login (store, {userId, userPw}) {
        let loginResponse = await loginAPI.doLogin(userId,userPw)
        processResponse(store,loginResponse)
        return store.getters.getIsAuth
    }
}
