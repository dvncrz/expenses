function convert2Thousand() {
    setTimeout(function () {
        const amount_bg = $('#amount .amount_bg')
        const amount = $('#amount .amount')
        const re = /([\/|\*|\-|\+]*[(]*[\d+]+[)]*)/g
        const re2 = /([\/|\*|\-|\+]*[(]*\d+[)]*)/g
        const re3 = /([\/\*\-\+])?([(]?\d+[)]?|[(]+)/g
        const re4 = /([\/\*\-\+])?([(]?\d+[)]?|([\/\*\-\+])+|[(]+)/g

        let paragraphed = amount_bg.html().match(re4)
        // let segregated = amount_bg.html().match(/(\d+)|(\+|\-|\*|\/|\(|\))/g)

        // classAdded = segregated.map(x => {
        //     if (!isNaN(x)) return `<span class="value">${new Intl.NumberFormat("es-CO").format(x)}</span>`
        //     else return `<span class="symbol">${x}</span>`
        // })

        classAdded = paragraphed.map(x => {
            console.log(x)
            let segregated = x.match(/(\d+)|(\+|\-|\*|\/|\(|\))/g)

            innerClass = segregated.map(y => {
                if (!isNaN(y)) return `<span class="value">${new Intl.NumberFormat("es-CO").format(y)}</span>`
                else return `<span class="symbol">${y}</span>`
            })
            return `<div class="line">${innerClass.join('')}</div>`
        })

        console.log(paragraphed)

        amount.html(classAdded)
    }, 50)
}

window.addEventListener('load', function () {
    const rows = 5
    const cols = 4
    const keys = ['(', ')', '+', '-', 7, 8, 9, '*', 4, 5, 6, '/', 1, 2, 3, 'DEL', 0, '000', 'C', 'ENTER']
    const numpad = document.querySelector('#amount span.numpad')
    const amount_bg = $('#amount .amount_bg')
    const amount = $('#amount .amount')
    const colors = ["red", "blue", "teal", "purple", "chocolate", "fuchsia", "green", "crimson", "yellow", "navajowhite"]
    let open = 0
    let close = 0

    for (r = 0; r < rows; r++) {
        let row = document.createElement('div')

        for (c = 0; c < cols; c++) {
            let col = document.createElement('div')
            col.innerHTML = keys[r * cols + c]
            col.setAttribute('data', keys[r * cols + c])

            col.addEventListener('click', function () {
                let text = amount_bg.html()
                let pressed = col.innerHTML

                convert2Thousand()

                // Delete
                if (pressed === "DEL") {
                    if (text.length > 1) amount_bg.html(text.slice(0, -1))
                    else amount_bg.html() = "0"
                }

                // Clear
                if (pressed === "C") amount_bg.html("0")

                // Enter
                if (pressed === "ENTER") {
                    try {
                        amount_bg.html(Math.round(eval(amount_bg.html())))
                    } catch (e) {
                        alert('Hay uno o varios errores. Por favor revise e intente de nuevo.')
                    }
                }

                // Type
                if (text === "0") {
                    if ("123456789(".indexOf(pressed) !== -1) amount_bg.html(pressed)
                } else {
                    let last = text.slice(-1)

                    if ("0123456789".indexOf(last) !== -1) {
                        if (")/*-+0123456789000".indexOf(pressed) !== -1) amount_bg.html(text + pressed)
                    }

                    if ("*/-+".indexOf(last) !== -1) {
                        if ("*/-+".indexOf(pressed) !== -1) amount_bg.html(text.slice(0, -1) + pressed)
                        if ("123456789(".indexOf(pressed) !== -1) amount_bg.html(text + pressed)
                    }

                    if ("(".indexOf(last) !== -1) {
                        if ("123456789(".indexOf(pressed) !== -1) amount_bg.html(text + pressed)
                    }

                    if (")".indexOf(last) !== -1) {
                        if ("/*-+".indexOf(pressed) !== -1) amount_bg.html(text + pressed)
                    }
                }
            }, false)

            row.appendChild(col)
        }
        numpad.appendChild(row)
    }
}, false)