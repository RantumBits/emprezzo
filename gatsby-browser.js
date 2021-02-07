exports.onClientEntry = () => {
  require('regenerator-runtime') //added this line to resolve error "ReferenceError: regeneratorRuntime is not defined"
}