let idTrabajador

const getTrabajadores = async () => {
    const response = await fetch("http://localhost:5042/api/Trabajadores");
    const trabajadores = await response.json();
    return trabajadores;
}

const getDepartamentos = async () => {
    const response = await fetch("http://localhost:5042/api/departamentos");
    const departamentos = await response.json();
    return departamentos;
}

const getProvincias = async () => {
    const response = await fetch("http://localhost:5042/api/provincias");
    const provincias = await response.json();
    return provincias;
}

const getDistritos = async () => {
    const response = await fetch("http://localhost:5042/api/distritos");
    const distritos = await response.json();
    return distritos;
}

const departamentos = await getDepartamentos()
const provincias = await getProvincias()
const distritos = await getDistritos()
const trabajadores = await getTrabajadores()

const formatearErrores = () => {
    // OCULTAR ERRORES
    document.getElementById("error-tipo-doc").style.display = "none"
    document.getElementById("error-num-doc").style.display = "none"
    document.getElementById("error-nombre").style.display = "none"
    document.getElementById("error-sexo").style.display = "none"
    document.getElementById("error-departamento").style.display = "none"
    document.getElementById("error-provincia").style.display = "none"
    document.getElementById("error-distrito").style.display = "none"
}

const formularioRegistroVacio = () => {
    document.getElementById("selectDoc").value = "null"
    document.getElementById("numeroDoc").value = ""
    document.getElementById("nombres").value = ""
    const sexo = document.getElementsByName("sexo")
    for (let i = 0; i < sexo.length; i++) {
        sexo[i].checked = false
    }
    document.getElementById("selectDep").value = "null"
    document.getElementById("selectProv").value = "null"
    document.getElementById("selectDist").value = "null"
}

const formularioModificar = async (id) => {
    const response = await fetch("http://localhost:5042/api/Trabajadores/" + id);
    const trabajador = await response.json();
    document.getElementById("selectDoc").value = trabajador.tipoDocumento
    document.getElementById("numeroDoc").value = trabajador.numeroDocumento
    document.getElementById("nombres").value = trabajador.nombres
    const sexo = document.getElementsByName("sexo")
    for (let i = 0; i < sexo.length; i++) {
        if (sexo[i].value == trabajador.sexo)
            sexo[i].checked = true
    }
    document.getElementById("selectDep").value = trabajador.idDepartamento
    listarProvincias(trabajador.idDepartamento)
    document.getElementById("selectProv").value = trabajador.idProvincia
    listarDistritos(trabajador.idProvincia)
    document.getElementById("selectDist").value = trabajador.idDistrito
}

const abrirModalModificar = async (id) => {
    idTrabajador = id
    if (id) {
        await formularioModificar(idTrabajador)
        formatearErrores()
        document.getElementById("modalR").style.display = "block";
    }
}

const abrirModalRegistro = () => {
    formularioRegistroVacio()
    formatearErrores()
    document.getElementById("modalR").style.display = "block";
}

const abrirModalEliminar = (id) => {
    idTrabajador = id
    document.getElementById("modalE").style.display = "block";
}

const listarTrabajadores = async (sexo) => {
    const tableBody = document.getElementById("table-body")
    while (tableBody.childNodes.length > 0) {
        tableBody.removeChild(tableBody.lastChild)
    }
    let trabajadoresFiltrados = trabajadores
    if (sexo !== "todos") {
        trabajadoresFiltrados = trabajadores.filter(e => e.sexo == sexo)
    }
    trabajadoresFiltrados.forEach(trabajador => {
        let row = document.createElement("tr")

        let cTipo = document.createElement("td")
        let cNumero = document.createElement("td")
        let cNombres = document.createElement("td")
        let cSexo = document.createElement("td")
        let cDepartamento = document.createElement("td")
        let cProvincia = document.createElement("td")
        let cDistrito = document.createElement("td")
        let cEdit = document.createElement("td")
        let cDelete = document.createElement("td")

        cTipo.innerText = trabajador.tipoDocumento
        cNumero.innerText = trabajador.numeroDocumento
        cNombres.innerText = trabajador.nombres
        cSexo.innerText = trabajador.sexo
        cDepartamento.innerText = departamentos.find(dep => dep.id == trabajador.idDepartamento).nombreDepartamento
        cProvincia.innerText = provincias.find(pro => pro.id == trabajador.idProvincia).nombreProvincia
        cDistrito.innerText = distritos.find(dis => dis.id == trabajador.idDistrito).nombreDistrito
        cEdit.innerHTML = '<button type="button" class="btn btn-primary">Actualizar</button>'
        cDelete.innerHTML = `<button type="button" class="btn btn-danger">Eliminar</button>`
        cEdit.addEventListener('click', () => abrirModalModificar(trabajador.id))
        cDelete.addEventListener('click', () => abrirModalEliminar(trabajador.id))

        row.appendChild(cTipo);
        row.appendChild(cNumero);
        row.appendChild(cNombres);
        row.appendChild(cSexo);
        row.appendChild(cDepartamento);
        row.appendChild(cProvincia);
        row.appendChild(cDistrito);
        row.appendChild(cEdit);
        row.appendChild(cDelete);
        const celdas = row.childNodes
        celdas.forEach(celda => {
            if (trabajador.sexo == "M") celda.style.background = "skyblue"
            else celda.style.background = "orange"
        })
        tableBody.appendChild(row)
    });
}

const cerrarModalRegistro = () => {
    idTrabajador = null
    document.getElementById("modalR").style.display = "none";
}

const cerrarModalEliminar = () => {
    idTrabajador = null
    document.getElementById("modalE").style.display = "none";
}

const deleteTrabajador = async () => {
    if (idTrabajador) {
        await fetch('http://localhost:5042/api/Trabajadores/' + idTrabajador, {
            method: 'DELETE',
        })
        cerrarModalEliminar()
        location.reload();
    }
}

const listarDistritos = (idProvincia) => {
    const select = document.getElementById("selectDist")
    while (select.childNodes.length > 0) {
        select.removeChild(select.lastChild)
    }
    let option = document.createElement("option")
    option.setAttribute("value", "null")
    option.innerText = "Elegir..."
    select.appendChild(option)
    if (idProvincia) {
        distritos.forEach(distrito => {
            if (distrito.idProvincia == idProvincia) {
                let option = document.createElement("option")
                option.setAttribute("value", distrito.id)
                option.innerText = distrito.nombreDistrito
                select.appendChild(option)
            }
        });
    }
}

const listarProvincias = (idDepartamento) => {
    const select = document.getElementById("selectProv")
    select.addEventListener("change", (e) => listarDistritos(e.target.value))
    while (select.childNodes.length > 0) {
        select.removeChild(select.lastChild)
    }
    let option = document.createElement("option")
    option.setAttribute("value", "null")
    option.innerText = "Elegir..."
    select.appendChild(option)
    provincias.forEach(provincia => {
        if (provincia.idDepartamento == idDepartamento) {
            let option = document.createElement("option")
            option.setAttribute("value", provincia.id)
            option.innerText = provincia.nombreProvincia
            select.appendChild(option)
        }
    });
}

const listarDepartamentos = () => {
    const select = document.getElementById("selectDep")

    select.addEventListener('change', (e) => {
        listarProvincias(e.target.value)
        listarDistritos(null)
    })

    departamentos.forEach(departamento => {
        let option = document.createElement("option")
        option.setAttribute("value", departamento.id)
        option.innerText = departamento.nombreDepartamento
        select.appendChild(option)
    });
}

const guardarTrabajador = async () => {
    const tipoDocumento = document.getElementById("selectDoc")
    const numeroDoc = document.getElementById("numeroDoc")
    const nombres = document.getElementById("nombres")
    const sexo = document.getElementsByName("sexo")
    let selectedSexo = null
    for (let i = 0; i < sexo.length; i++) {
        if (sexo[i].checked) {
            selectedSexo = sexo[i].value
        }
    }
    const departamento = document.getElementById("selectDep")
    const provincia = document.getElementById("selectProv")
    const distrito = document.getElementById("selectDist")

    if (tipoDocumento.value == "null") document.getElementById("error-tipo-doc").style.display = "block"
    if (numeroDoc.value == "") document.getElementById("error-num-doc").style.display = "block"
    if (nombres.value == "") document.getElementById("error-nombre").style.display = "block"
    if (selectedSexo == null) document.getElementById("error-sexo").style.display = "block"
    if (departamento.value == "null") document.getElementById("error-departamento").style.display = "block"
    if (provincia.value == "null") document.getElementById("error-provincia").style.display = "block"
    if (distrito.value == "null") document.getElementById("error-distrito").style.display = "block"

    if (
        tipoDocumento.value == "null" ||
        numeroDoc.value == "" ||
        nombres.value == "" ||
        selectedSexo == null ||
        departamento.value == "null" ||
        provincia.value == "null" ||
        distrito.value == "null"
    ) return

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = {
        "tipoDocumento": tipoDocumento.value,
        "numeroDocumento": numeroDoc.value,
        "nombres": nombres.value,
        "sexo": selectedSexo,
        "idDepartamento": Number(departamento.value),
        "idProvincia": Number(provincia.value),
        "idDistrito": Number(distrito.value)
    };
    if (idTrabajador) {
        raw.id = idTrabajador
        const requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(raw),
            redirect: 'follow'
        };
        await fetch('http://localhost:5042/api/Trabajadores/' + idTrabajador, requestOptions)
    } else {
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(raw),
            redirect: 'follow'
        };
        await fetch('http://localhost:5042/api/Trabajadores', requestOptions)
    }
    cerrarModalRegistro()
    location.reload()
}

document.getElementById("buttonConfirmarRegistro").addEventListener("click", guardarTrabajador)
document.getElementById("buttonRegistro").addEventListener('click', abrirModalRegistro)
document.getElementById("selectSexo").addEventListener("change", (e) => listarTrabajadores(e.target.value))
document.getElementById("buttonCerrarRegistro").addEventListener('click', cerrarModalRegistro)
document.getElementById("buttonCancelarEliminar").addEventListener('click', cerrarModalEliminar)
document.getElementById("buttonAceptarEliminar").addEventListener('click', deleteTrabajador)
listarTrabajadores("todos")
listarDepartamentos()
