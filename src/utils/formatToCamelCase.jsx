const formatToCamelCase = (words) => {
    return words.split('_').map((word, index)=>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ')
}

export default formatToCamelCase