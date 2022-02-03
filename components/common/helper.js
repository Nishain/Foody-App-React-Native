
export default {
    generateCode : (codeLength)=>{
        const alphabet = '0213456789abcdefghijklmnopqrstuvwxyz'
        var code = ''
        for ( var i = 0; i < codeLength; i++ ){
            code += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
        }
        return code
    },
    makeCodingFriendly : (text)=>{
        //remove spaces and make first letter simple eg 'Camel Case' to 'camelCase' ....
        return (text.charAt(0).toLowerCase() + text.slice(1)).replace(' ','')
    }
}