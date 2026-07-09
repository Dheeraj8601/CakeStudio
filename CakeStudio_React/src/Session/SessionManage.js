class SessionManage {
    async setUserId(value) {
        sessionStorage.setItem('id', value)
    }
    getUserId() {
        const userId = sessionStorage.getItem('id');
        return userId;
    }

    async setUserRole(value){
        sessionStorage.setItem('role',value)
    }

    getUserRole(){
        return sessionStorage.getItem('role')
    }

    async setTokenId(value) {
        sessionStorage.setItem('token', value);
    }
    getTokenId() {
        return sessionStorage.getItem('token')
    }

    async setRefreshToken(value) {
        sessionStorage.setItem('atoken', value);
    }
    getRefreshToken() {
        return sessionStorage.getItem('atoken')
    }

    clearSession() {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("atoken");
        sessionStorage.removeItem("id");
        sessionStorage.removeItem("role");
    }
}

export default new SessionManage();