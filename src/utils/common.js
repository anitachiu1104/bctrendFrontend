let dateTimeFormat = (gmtTime, type) => {
    let time = gmtTime instanceof Date ?gmtTime:new Date(+new Date(gmtTime) - 8 * 60 * 60 * 1000)
    let year = time.getFullYear()
    const month = (time.getMonth() + 1).toString().padStart(2, '0')
    const date = (time.getDate()).toString().padStart(2, '0')
    const hours = (time.getHours()).toString().padStart(2, '0')
    const minute = (time.getMinutes()).toString().padStart(2, '0')
    const second = (time.getSeconds()).toString().padStart(2, '0')
    return {
        month_day: month + '-' + date,
        minute_second: minute + ':' + second,
        full: year + '-' + month + '-' + date + ' ' + hours + ':' + minute + ':' + second
    }  
}

export {
    dateTimeFormat
}