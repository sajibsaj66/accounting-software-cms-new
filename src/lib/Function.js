
const accessChecker = (accessName) => {
      let auth =  JSON.parse(sessionStorage.getItem('auth_info'));
      if(auth.access != undefined || auth.access.length != 0){
           let access = JSON.parse(auth.access)
           return access.indexOf(accessName);
      }else{
            return false
      }
      
}

export { accessChecker};