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

    clearSession() {
        // sessionStorage.removeItem("token");
        // sessionStorage.removeItem("atoken");
        sessionStorage.removeItem("id");
        sessionStorage.removeItem("role");
    }
}

export default new SessionManage();