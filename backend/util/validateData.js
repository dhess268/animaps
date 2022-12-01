
const validateNewUser = (req) => {
  if(req.body.username && req.body.firstname && req.body.lastname && req.body.email && req.body.password && req.body.addressString && req.body.addressLatLng){
    return true
  } else {
    return false
  }
}

const validateUpdateUser = (req) => {
  if(req.body.firstname !== '' && req.body.lastname !== ''  && req.body.addressString && req.body.addressLatLng) {
    return true
  } else {
    return false
  }
}

module.exports = {validateNewUser, validateUpdateUser}
