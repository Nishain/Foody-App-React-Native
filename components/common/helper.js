
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
    },
    mapToHTMLTemplate : (mapping,template) => {
        var processedTemplate = template
        for(const key in mapping){
            processedTemplate = processedTemplate.replace(`{${key}}`,mapping[key])
        }
        return processedTemplate
    },
    encloseTag : (tag,childArray) => {
        return childArray.map(child => `<${tag}>${child}</${tag}>`).join('') 
    },
    populateDataToHTML : (sectionName,template,data)=>{
        const repeatTagLength = `{${sectionName}.repeat}`.length
        const repeatingTemplate = template.substring(template.indexOf(`{${sectionName}.repeat}`) + repeatTagLength , template.lastIndexOf(`{${sectionName}.repeat`))
        return data.map(item => Object.keys(item).reduce((processingTemplate,itemKey)=>processingTemplate.replace(`{${itemKey}}`,item[itemKey]),repeatingTemplate)).join("")
    },
    populateSingleHTMLSection : (sectionName,template,data)=>{
        const sectionTagLength = `{${sectionName}.single}`.length
        const dynamicContentTemplate = template.substring(template.indexOf(`{${sectionName}.single}`) + sectionTagLength , template.lastIndexOf(`{${sectionName}.single`))
        return Object.keys(data).reduce((processingTemplate,itemKey)=>processingTemplate.replace(`{${itemKey}}`,data[itemKey]),dynamicContentTemplate)
    }
}