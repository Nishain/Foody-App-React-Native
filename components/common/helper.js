
export default {
    generateCode : (codeLength)=>{
        const alphabet = '0213456789abcdefghijklmnopqrstuvwxyz'
        var code = ''
        for ( var i = 0; i < codeLength; i++ ){
            code += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
        }
        return code
    }
}