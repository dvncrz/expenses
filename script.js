const dataSheets = {
    cruzyomayusa: {
        sheetId: "AKfycbxfLev9aB_I5fjXvNXqY5cjsRUY7W3yImDnhOV-1kFPLe05dS-AhBtsqEnnx-Qq7sTa",
        A_user: "Paola",
        B_user: "Duvan"
    },
    infantecruz: {
        sheetId: "AKfycbxfLev9aB_I5fjXvNXqY5cjsRUY7W3yImDnhOV-1kFPLe05dS-AhBtsqEnnx-Qq7sTa",
        A_user: "Angélica",
        B_user: "Carlos"
    },
    fonsecacruz: {
        sheetId: "AKfycbxfLev9aB_I5fjXvNXqY5cjsRUY7W3yImDnhOV-1kFPLe05dS-AhBtsqEnnx-Qq7sTa",
        A_user: "Paola",
        B_user: "Gustavo"
    },
    close: null
}

let source

function loadDate() {
    setTimeout(function () {
        document.querySelector('input[type="date"]').value = moment().format().split('T')[0]
        getDate()
    }, 1)
}

function getDate() {
    console.log(document.querySelector("#date").value)
    document.querySelector("#date_formatted").innerHTML = moment(document.querySelector("#date").value, "YYYY-MM-DD").format('LL')

    if (document.querySelector("#date").value) {
        document.querySelector("#date").setAttribute('data-date', moment(document.querySelector("#date").value, "YYYY-MM-DD").format('LL'))
    } else {
        loadDate()
    }
}

function openAmount() {
    showMask()
    document.querySelector("#amount").classList.remove('hide')
    document.querySelector("#amount").classList.add('show')
}

function closeAmount() {
    hideMask()
    document.querySelector("#amount").classList.remove('show')
    document.querySelector("#amount").classList.add('hide')

    // document.querySelector("input[placeholder='Valor']").value = document.querySelector("#amount .amount_bg").innerText
    document.querySelector("input[name='VALOR_DUMMY']").value = '$' + document.querySelector("#amount .amount div.line span.value").innerText
    document.querySelector("input[name='VALOR']").value = document.querySelector("#amount .amount_bg").innerText
}

function resetAmount() {
    document.querySelector("#amount .amount_bg").innerText = ''
    document.querySelector("#amount .amount").innerText = ''
}

function hideMask() {
    document.querySelector("#mask").classList.remove('show')
    document.querySelector("#mask").classList.add('hide')
}

function showMask() {
    document.querySelector("#mask").classList.remove('hide')
    document.querySelector("#mask").classList.add('show')
}

function openFullscreen() {
    let elem = document.querySelector("body");

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
        document.querySelector("#greeting").classList.add('hide')
        hideMask()
    } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
        hideMask()
    } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
        hideMask()
    }
}

window.addEventListener('load', function () {
    const urlParams = new URLSearchParams(window.location.search);
    source = urlParams.get('source');

    if (source === null || source === '' || Object.keys(dataSheets).indexOf(source) === -1) window.open("/notfound", "_self")

    loadDate()

    document.querySelector("input[placeholder='Valor']").addEventListener('click', function () {
        openAmount()
    }, false)

    document.querySelector('input[type="radio"][name="PAGADO POR"][value="Alice"]').parentElement.innerHTML = document.querySelector('input[type="radio"][name="PAGADO POR"][value="Alice"]').parentElement.innerHTML.replaceAll('Alice', dataSheets[source].A_user)
    document.querySelector('input[type="radio"][name="PAGADO POR"][value="Bob"]').parentElement.innerHTML = document.querySelector('input[type="radio"][name="PAGADO POR"][value="Bob"]').parentElement.innerHTML.replaceAll('Bob', dataSheets[source].B_user)

    document.querySelector("#date_formatted").addEventListener('click', function () {
        document.querySelector("input#date").showPicker()
    }, false)

    document.getElementById("form").addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent the default form submission
        document.getElementById("message").textContent = "Guardando...";
        document.getElementById("message").style.display = "block";
        showMask()
        document.getElementById("submit-button").disabled = true;

        // Collect the form data
        var formData = new FormData(this);
        var keyValuePairs = [];

        for (var pair of formData.entries()) {
            keyValuePairs.push(pair[0] + "=" + pair[1]);
        }

        var formDataString = keyValuePairs.join("&");

        // Send a POST request to your Google Apps Script
        fetch(`https://script.google.com/macros/s/${dataSheets[source].sheetId}/exec`, {
                redirect: "follow",
                method: "POST",
                body: formDataString,
                headers: {
                    "Content-Type": "text/plain;charset=utf-8",
                },
            })
            .then(function (response) {
                // Check if the request was successful
                if (response) {
                    return response; // Assuming your script returns JSON response
                } else {
                    throw new Error("Falló al intentar guardar los datos");
                }
            })
            .then(function (data) {
                // Display a success message
                document.getElementById("message").textContent = "¡Datos guardados exitosamente!";
                document.getElementById("message").style.display = "block";
                showMask()
                document.getElementById("message").style.backgroundColor = "green";
                document.getElementById("message").style.color = "beige";
                document.getElementById("submit-button").disabled = false;
                document.getElementById("form").reset();

                setTimeout(function () {
                    document.getElementById("message").textContent = "";
                    document.getElementById("message").style.display = "none";
                    hideMask()
                }, 2600);
            })
            .catch(function (error) {
                // Handle errors, you can display an error message here
                console.error(error);
                document.getElementById("message").textContent = "Ha ocurrido un error al intentar guardar los datos.";
                document.getElementById("message").style.display = "block";
                showMask()
            });
    });

    document.querySelector("#date").addEventListener('change', function (evt) {
        getDate()
    })

}, false)