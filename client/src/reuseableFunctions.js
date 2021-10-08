

function clickDay(value){
    // let dateLongFormat = new Date()
    // let fullDate = dateLongFormat.toString(" ").split(" ").slice(0,4).join(" ")
    console.log(value)
    console.log("selected day value returned:")
    console.log(value.toString().split(" "))
    let parsedDate = value.toString().split(" ")
    console.log("PARSED Date")
    console.log(parsedDate)
    
    const fullDate = parsedDate.slice(0,4).join(" ")
    console.log("FULLDATE: " + fullDate)
    const weekday = parsedDate[0]
    parsedDate = [parsedDate[1],parsedDate[2],parsedDate[3]]
   
    console.log(parsedDate)
    parsedDate = parsedDate.join("-") 
    console.log(parsedDate) //parsed date hyphenated will be used to determine url for event/journal per day
    console.log(weekday)
    // dayContext = {
    //     day: parsedDate,
    //     weekday: weekday,
    //     fullDate:fullDate
    // } //obj format to import/export properly
   console.log("FULL Date")
    
    sessionStorage.setItem("day", parsedDate)
    sessionStorage.setItem("weekday",weekday)
    sessionStorage.setItem("fullDate",fullDate)
    console.log("from local storage")
console.log(sessionStorage.getItem("day"))
    // history.push(urlPath) //nav to date view 

}

export default clickDay