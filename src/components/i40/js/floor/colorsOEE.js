

function ObtenerColorOEE(value){
    let color = ""

    if(value <= 65)
        color="#CD0000"
    else if(value > 65 && value <= 75)
        color="#FF8C00"
    else if(value > 75 && value <= 85)
        color="#FFD700"
    else if(value > 85 && value <= 95)
        color="#40a070"
    else
        color="#00C5CD"

    return color
}

export default ObtenerColorOEE