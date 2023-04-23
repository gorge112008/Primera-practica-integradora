const socket = io();
let storeProducts = [];
let URLdomain = window.location.host;
let protocol = window.location.protocol;
let Url = protocol + "//" + URLdomain + "/api/products/";
let btnsDelete;
let opc = "update";
let resExo=[];

const labelContain = document.querySelectorAll(".input-field label");
const h3Contain = document.querySelector("#container h3");
const form = document.querySelector("form");
const fluid2 = document.querySelector("#container-fluid2");
const cancelar = document.querySelector("#btnCancel");
const validateProducts = document.querySelector("#validate");

const inputTittle = document.querySelector("#tittle"),
  inputDescription = document.querySelector("#description"),
  inputCode = document.querySelector("#code"),
  inputPrice = document.querySelector("#price"),
  inputStock = document.querySelector("#stock"),
  inputThumbnail = document.querySelector("#thumbnail"),
  contain = document.querySelector("#dinamic-contain");
btn_return = document.querySelector("#btn-return");

class NewProduct {
  constructor() {
    this.tittle = inputTittle.value;
    this.description = inputDescription.value;
    this.code = +inputCode.value;
    this.status = true;
    this.stock = +inputStock.value;
    this.category = "Food";
    this.price = +inputPrice.value;
    this.thumbnail = validarUrl()
      ? inputThumbnail.value
      : "https://energiaypotencia.com/img/imagen-no-disponible.jpg";
  }
}

socket.on("products", async (getProducts) => {
  Object.assign(storeProducts, getProducts); //ASIGNAR PRODUCTOS AL STORE
  selectAction(); //SELECCIONAR ACCIONES
  selectDelete();
});

//funciones
async function crearHtml() {
  contain.innerHTML = "";
  let html;
  for (const product of storeProducts) {
    if (product.status == false && opc == "update") continue;
    html = `<div class="card">
<div class="card-image">
 <a class=${opc} href="/realtimeproducts/${product._id}"></a>
 <img class="responsive-img" src=${product.thumbnail} />
 <span class="card-title">${product.tittle}</span>
</div>
<div class="card-content">
 <b class="card-description">
   ${product.description}
 </b>
 <p>$${product.price}</p>
 <b>Code: <b class="code">${product.code}</b></b>
</div>
<div class="card-action">
 <input type= "button" id=${product._id} class="btn" value="Delete" >
</div>
</div>`;
    contain.innerHTML += html;
  }
  btnsDelete = document.querySelectorAll(".btn");
  return btnsDelete;
}

function validarUrl() {
  try {
    new URL(inputThumbnail.value);
    return true;
  } catch (err) {
    return false;
  }
}

async function selectAction() {
  if (storeProducts.length == 1) {
    //SE ASIGNA LA ACCION DE UPDATE
    fluid2.classList.add("updating-product");
    h3Contain.innerHTML = "Update Product";
    inputTittle.value = storeProducts[0].tittle;
    inputDescription.value = storeProducts[0].description;
    inputCode.value = storeProducts[0].code;
    inputPrice.value = storeProducts[0].price;
    inputStock.value = storeProducts[0].stock;
    inputThumbnail.value = storeProducts[0].thumbnail;
    labelContain.forEach((label) => {
      label.focus();
    });
    if (opc != "reset") {
      updateProducts(Url, storeProducts[0]._id, { status: false });
      socket.emit(
        "updatingProduct",
        storeProducts[0].tittle + " actualizandose..."
      );
      opc = "reset";
    } else {
      selectDelete();
    }
  } else {
    fluid2.classList.remove("updating-product");
    h3Contain.innerHTML = "Ingresa un producto";
    opc = "update";
  }
}

async function getData(id) {
  try {
    if (id) {
      let key = Url + id;
      let response = await fetch(key, {
        method: "GET",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        mode: "cors",
      });
      const data = await response.json();
      return data;
    } else {
      let response = await fetch(Url, {
        method: "GET",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        mode: "cors",
      });
      const data = await response.json();
      return data;
    }
  } catch {
    console.log(Error);
  }
}

async function deleteData(url, id) {
  try {
    let key = url + id;
    let response = await fetch(key, {
      method: "DELETE",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
    });
    return response.json();
  } catch {
    console.log(Error);
  }
}

async function postData(url, data) {
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
      body: JSON.stringify(data),
    });
    if (response.status == 400) {
      console.log("Error en el servidor");
      return;
    } else if (response.status == 200) {
      return response.json();
    }
  } catch {
    console.log(Error);
  }
}

async function updateProducts(url, id, data) {
  try {
    let key = url + id;
    let response = await fetch(key, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
      body: JSON.stringify(data),
    });
    if (response.status == 400) {
      return;
    } else if (response.status == 200) {
      const datos = await response.json();
      return datos;
    }
  } catch {
    console.log(Error);
  }
}

inputThumbnail.addEventListener("click", () => {
  inputThumbnail.select();
});

async function selectDelete() {
  btnsDelete = await crearHtml();
  btnsDelete.forEach((selectBtn) => {
    selectBtn.addEventListener("click", async () => {
      storeProducts.forEach((searchID) => {
        if (searchID._id == selectBtn.id) {
          Swal.fire({
            title:
              "YOU WANT TO DELETE THE PRODUCT " +
              searchID.tittle.toUpperCase() +
              " ?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "YES",
            denyButtonText: "NOT",
          }).then((result) => {
            if (result.isConfirmed) {
              deleteData(Url, searchID._id)
                .then(async (data) => {
                  storeProducts = await getData();
                  selectDelete();
                  Swal.fire({
                    title: "Product Removed Successfully!!!",
                    text:
                      "Product Removed>> " +
                      "ID: " +
                      data +
                      " --> " +
                      searchID.tittle,
                    icon: "success",
                    confirmButtonText: "Accept",
                  });
                  socket.emit("deleteproduct", "Producto Eliminado");
                })
                .catch((error) => console.log("Error:" + error));
            } else if (result.isDenied) {
              Swal.fire("ACTION CANCELED", "", "info");
            }
          });
        }
      });
    });
  });
}

async function pushData(data) {
  storeProducts = await getData();
  selectDelete();
  Swal.fire({
    title: "Product Added Successfully!",
    text: "Registered Product: " + data.tittle,
    icon: "success",
    confirmButtonText: "Accept",
  });
  form.reset();
  socket.emit("addproduct", "Nuevo Producto Agregado");
}

function updateData(data) {
  Swal.fire({
    title: "ESTA SEGURO DE MODIFICAR EL PRODUCTO?",
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: "SI",
    denyButtonText: "NO",
  }).then(async (result) => {
    if (result.isConfirmed) {
      Swal.fire({
        position: "center",
        text: "Updated Product: " + data.tittle,
        icon: "success",
        title: "Product Update Successfully!",
        showConfirmButton: false,
      });
      socket.emit("updateproduct", "Datos Actualizados");
      setTimeout(() => {
        window.location.href = "../realtimeproducts";
      }, 1500);
    } else if (result.isDenied) {
      Swal.fire("ACCIÓN CANCELADA", "", "info");
      return;
    }
  });
}
socket.on("f5NewProduct", async (msj) => {
  console.log(msj);
  if (storeProducts.length != 1) {
    storeProducts = await getData();
    selectDelete();
  }
});

socket.on("f5deleteProduct", async (msj) => {
  console.log(msj);
  if (storeProducts.length != 1) {
    storeProducts = await getData();
    selectDelete();
  }
});

socket.on("f5updateProduct", async (msj) => {
  console.log(msj);
  if (storeProducts.length != 1) {
    storeProducts = await getData();
    selectDelete();
  }
});

socket.on("updatingProduct", async (msj) => {
  console.log(msj);
  if (storeProducts.length != 1) {
    storeProducts = await getData();
    selectDelete();
  }else{
    validateProducts.classList.add("hidden");
  }
});

cancelar.onclick = () => {
  if (storeProducts.length == 1) {
    updateProducts(Url, storeProducts[0]._id, { status: true });
    socket.emit("updateproduct", "Productos Actualizados");
    window.location.href = "../realtimeproducts";
  } else {
    form.reset();
  }
};

//***************************** PROCESO DE VALIDACION DE PRODUCTOS OCULTOS *********************************************//

/*CUANDO UN USUARIO EDITA UN PRODUCTO, EL PRODUCTO ADQUIERE UNA PROPIEDAD DE STATUS FALSE, ESTO EVITARIA QUE OTRO USUARIO
EDITE AL MISMO TIEMPO EL MISMO PRODUCTO. PERO SI EL USUARIO EDITOR NO GUARDA NI CANCELA LA EDICION, EL PRODUCTO QUEDA CON STATUS FALSE
EVITANDO QUE EL PRODUCTO PUEDA SER MODIFICADO AUN CUANDO YA NADIE LO ESTA EDITANDO.
ESTOS PRODUCTOS SERAN CONSIDERADOS COMO PRODUCTOS OCULTOS, ESTO SIGNIFICA QUE EL PRODUCTO NO SE MOSTRARA EN LA PAGINA DE PRODUCTOS.
ENTONCES PARA QUE EL PRODUCTO VUELVA A MOSTRARSE EN LA PAGINA DE PRODUCTOS, SE DEBE VALIDAR EL PRODUCTO
ESTO SE HACE CON EL BOTON DE VALIDAR PRODUCTOS (VALIDATE), EL CUAL LLAMA A LA FUNCION DE VALIDAR STATUS (validateStatus),
ESTA FUNCION BUSCA LOS PRODUCTOS CON STATUS FALSE Y LOS DEVUELVE A TRUE MOSTRANDOLOS EN LA PAGINA DE PRODUCTOS Y PERMITIENDO SU MODIFICACION.
UNA VEZ VALIDADOS LOS PRODUCTOS, SE ACTUALIZA LA PAGINA DE PRODUCTOS EN EL USUARIO ACTUAL Y TODOS LOS USUARIOS CONECTADOS EN TIEMPO REAL*/

//*******************************PROCESO DE EXONERACION DE PRODUCTOS ACTUALIZANDOSE**************************************//

/*CUANDO SE ACTIVA EL BOTON DE VALIDACION, SI UN PRODUCTO AUN ESTA SIENDO EDITADO POR OTRO USUARIO, ESTE PRODUCTO NO SE VALIDA
Y ENTRA EN UN GRUPO DE EXONERACION, EL CUAL SE VALIDA CUANDO EL USUARIO QUE ESTA EDITANDO EL PRODUCTO LO GUARDA CORRECTAMENTE,
CASO CONTRARIO SE EXCEPTA DEL GRUPO DE EXONERACION Y SOLO PODRA SER VALIDADO MEDIANTE EL BOTON DE VALIDACION DE PRODUCTOS.*/

validateProducts.onclick = async () => {
  try {
    //console.log("Iniciando Validación de Productos");
    socket.emit("exonerarStatus", "Exonerando Status");
    const validProducts = await validarStatus(resExo);
    //console.log("Productos Validados Correctamente" + validProducts);
    //console.log("Vaciando arreglo de Exoneraciones");
    resExo.length==0?socket.emit("finExo", "Exoneración Finalizada"):validateProducts.classList.remove("hidden");
    resExo=[];
    socket.emit("validateStatus", validProducts);
  } catch {
    console.log("Error al Validando Productos");
  }
};
socket.on("ordenExonerar", async (msj) => {
  console.log(msj);
  if (storeProducts.length == 1) {
    socket.emit("responseExonerar", storeProducts[0]._id);
    //console.log("Response de producto a exonerar emitido");
  }
});

socket.on("idExonerar", async (id) => {
  //console.log("Id de exoneracion recibida: "+id);
  resExo.push(id);
  //console.log("Id de exoneracion agregada: "+resExo);
});

socket.on("actualizar", async (products) => {
  console.log("Validacion Exitosa");
  if (storeProducts.length != 1) {
    storeProducts=products;
    selectDelete();
  }
});

socket.on("finValidate", async (msj) => {
  console.log(msj);
  validateProducts.classList.add("hidden");
});

async function validarStatus(idExo) {
  let getProducts = await getData();
  for (const product of getProducts) {
    if (idExo.includes(product._id)) continue;
    if (product.status == false) {
      updateProducts(Url, product._id, { status: true });
    }
  }
  const newProducts = await getData();
  return newProducts;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const product = new NewProduct();
  if (storeProducts.length == 1) {
    updateProducts(Url, storeProducts[0]._id, product)
      .then((data) => {
        if (data == null) {
          Swal.fire({
            title: "Error>> Repeated Code f",
            text: "Please enter a new code",
            icon: "error",
            confirmButtonText: "Accept",
          });
          inputCode.value = "";
          inputCode.focus();
        } else {
          updateData(data);
        }
      })
      .catch((error) => console.log("Error:" + error));
  } else {
    postData(Url, product)
      .then((data) => {
        if (data == null) {
          Swal.fire({
            title: "Error>> Repeated Code f",
            text: "Please enter a new code",
            icon: "error",
            confirmButtonText: "Accept",
          });
          inputCode.value = "";
          inputCode.focus();
        } else {
          form.reset();
          pushData(data);
        }
      })
      .catch((error) => console.log("Error:" + error));
  }
});
