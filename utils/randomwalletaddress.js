const crypto = require ('crypto')


function genrateWalletAddress (){
    return crypto.randomBytes(8).toString('hex')
}

module.exports = genrateWalletAddress;