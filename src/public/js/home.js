const socket = io();
let storeProducts = [];
let URLdomain = window.location.host;
let protocol = window.location.protocol;
let Url = protocol + "//" + URLdomain + "/api/products/";
let btnsDelete;
let opc = "update";

const labelContain = document.querySelectorAll(".input-field label");
const h3Contain = document.querySelector("#dinamic-contain h3");
const form = document.querySelector("form");

const inputTittle = document.querySelector("#tittle"),
  inputDescription = document.querySelector("#description"),
  inputCode = document.querySelector("#code"),
  inputPrice = document.querySelector("#price"),
  inputStock = document.querySelector("#stock"),
  inputThumbnail = document.querySelector("#thumbnail"),
  contain = document.querySelector("#contain");

class NewProduct {
  constructor(up) {
    this.tittle = inputTittle.value;
    this.description = inputDescription.value;
    this.code = +inputCode.value;
    up ? (this.status = false) : (this.status = true);
    this.stock = +inputStock.value;
    this.category = "Food";
    this.price = +inputPrice.value;
    this.thumbnail =
      inputThumbnail.value == ""
        ? "https://energiaypotencia.com/img/imagen-no-disponible.jpg"
        : inputThumbnail.value;
  }
}

socket.on("products", async (getProducts) => {
  Object.assign(storeProducts, getProducts); //ASIGNAR PRODUCTOS AL STORE
  selectAction(); //SELECCIONAR ACCIONES
  selectDelete();
});

//funciones
async function crearHtml(idUpdating) {
  contain.innerHTML = "";
  let html;
  for (const product of storeProducts) {
    if (product.status == false && opc == "update") continue;
    if (idUpdating) {
      product._id == idUpdating ? (opc = "updating") : (opc = "update");
    }
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

async function selectAction() {
  if (storeProducts.length == 1) {
    //SE ASIGNA LA ACCION DE UPDATE
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
      const product = new NewProduct(1);
      updateProducts(Url, product);
      socket.emit("updatingProduct", "Actualizando " + storeProducts[0].tittle);
      opc = "reset";
    } else {
      selectDelete();
    }
  } else {
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

async function updateProducts(url, data) {
  try {
    let key = url + storeProducts[0]._id;
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
  storeProducts=await getData();
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
        text: "Updated Product: " + data[0].tittle,
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
  storeProducts = await getData();
  selectDelete();
});

socket.on("f5deleteProduct", async (msj) => {
  console.log(msj);
  storeProducts = await getData();
  selectDelete();
});

socket.on("f5updateProduct", async (msj) => {
  console.log(msj);
  storeProducts = await getData();
  selectDelete();
});

socket.on("update", async (msj) => {
  console.log(msj);
  storeProducts = await getData();
  selectDelete();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const product = new NewProduct();
  if (storeProducts.length == 1) {
    updateProducts(Url, product)
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
