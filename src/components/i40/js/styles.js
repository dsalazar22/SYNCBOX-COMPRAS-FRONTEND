

var infoColors = {
    infoColorTOC: function (value) {
        let color = ''
        if (value < 0) {
            color = 'primary'
        } else if (value > 0 && value <= 33) {
            color = 'success'
        } else if (value >33 && value <= 66) {
            color = 'warning'
        } else if (value > 66 && value <= 100) {
            color = 'danger'
        } else {
           color = 'dark'
        }
        return color
    },

    infoBackgroudTOC: function (value) {
        let color = ''
        if (value < 0) {
            color = 'bg-primary'
        } else if (value > 0 && value <= 33) {
            color = 'bg-success'
        } else if (value >33 && value <= 66) {
            color = 'bg-warning'
        } else if (value > 66 && value <= 100) {
            color = 'bg-danger'
        } else {
           color = 'bg-dark'
        }
        return color
    },

    infoTextTOC: function (value) {
        let color = ''
        if (value < 0) {
            color = 'text-white'
        } else if (value > 0 && value <= 33) {
            color = 'text-white'
        } else if (value >33 && value <= 66) {
            color = 'text-dark'
        } else if (value > 66 && value <= 100) {
            color = 'text-white'
        } else {
           color = 'text-white'
        }
        return color
    },
}

export {
    infoColors
  }