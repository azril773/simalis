const token = document.querySelector("[name=csrfmiddlewaretoken]").value;
const modalAdd = new bootstrap.Modal("#addModalBarang");
const modalEdit = new bootstrap.Modal("#editModalBarang");

$(window).on("keydown", function (e) {
  if (e.key == "Escape") {
    modalAdd.hide();
    modalEdit.hide();
  }

  // if click alt+a modal add show up
  if (e.altKey && e.key == "a") {
    modalAdd.show();
  }
});

$("#addModalBarang").on("show.bs.modal", function (e) {
  console.log(e);
  setTimeout(() => {
    $("#nama_barangAdd").focus();
  }, 500);
});

const table = new DataTable(".tableBarang", {
  ajax: {
    url: `${ip}/atk/getBarang/`,
    type: "get",
    headers: { "X-CSRFToken": token },
  },
  columns: [
    { data: "barang.nama_barang" },
    {
      data: "barang.harga",
      render: function (data, type, row, meta) {
        const numberFormat = parseInt(data).toLocaleString("id-ID", {
          currency: "IDR",
          style: "currency",
        });
        return `<span class="w-full"><p class="text-end">${numberFormat.replace(
          ",00",
          ""
        )}</p></span>`;
      },
    },
    {
      data: "barang.harga_jual",
      render: function (data, type, row, meta) {
        const numberFormat = parseInt(data).toLocaleString("id-ID", {
          currency: "IDR",
          style: "currency",
        });
        return `<span class="w-full"><p class="text-end">${numberFormat.replace(
          ",00",
          ""
        )}</p></span>`;
      },
    },
    { data: "kategori" },
    { data: "stok",
      render:(d,t,r,m) => {
        return formatHrg(d)
      }
     },
    {
      data: "status",
      render: function (data, type, row, meta) {
        if (data == "AC") {
          return `<span class="text-success">Active</span>`;
        } else {
          return `<span class="text-danger">Deactive</span>`;
        }
      },
    },
    {
      data: "aksi",
      render: function (data, type, row, meta) {
        return `<a href="" class="btn btn-primary modalButton" data-bs-toggle="modal" data-bs-target="#editModalBarang" data-id="${data}">Edit</a>`;
      },
    },
  ],
});

const kategori = $("#kategoriAdd").selectize({
  maxOptions: 5,
  onChange: changeKategori,
});

const kategoriEdit = $("#kategoriEdit").selectize({
  maxOptions: 5,
  onChange:changeKategoriEdit
});

$(".tableBarang").click(function (e) {
  if (e.target.classList.contains("modalButton")) {
    const id = e.target.getAttribute("data-id");
    $.ajax({
      url: `${ip}/atk/getBarangById/`,
      type: "post",
      data: { id },
      headers: { "X-CSRFToken": token },
      success: (e) => {
        console.log(e);
        $("#nama_barangEdit").val(e.data.fields.barang);
        $("#hargaJ_barangEdit").val(formatH(e.data.fields.harga_jual));
        $("#idEdit").val(e.data.pk);
        // $("#kategori_barang").html(""/)
        kategoriEdit[0].selectize.setValue(e.data.fields.kategori_id);
        setTimeout(() => {
          $("#nama_barangEdit").focus();
        }, 500);
      },
    });
  }
});

$("#buttonEditBarang").click(function (e) {
  const nama_barang = $("#nama_barangEdit").val();
  const hargaJ_barang = $("#hargaJ_barangEdit").val().split(".").join("");
  const kategori = $("#kategoriEdit").val();
  const id = $("#idEdit").val();
  console.log(id);
  $.ajax({
    url: `${ip}/atk/editBarang/`,
    type: "post",
    data: { id, nama_barang,harga_jual:hargaJ_barang, kategori },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      console.log(e);
      if (e.msg.length !== 0) {
        $("#msg").html("");
        e.msg.forEach((err) => {
          console.log(err);
          $("#msg").append(`<li class="alert alert-danger">${err}</li>`);
        });
      }
      table.ajax.reload();
      modalEdit.hide();
    },
  });
});

$("#buttonAddBarang").click(function (e) {
  const nama_barang = $("#nama_barangAdd").val();
  const hargaJ_barang = $("#hargaJ_barangAdd").val().split(".").join("");
  const kategoris = $("#kategoriAdd").val();
  $.ajax({
    url: `${ip}/atk/tambahBarang/`,
    type: "post",
    data: { nama_barang,harga_jual:hargaJ_barang, kategori:kategoris },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      const nama_barang = $("#nama_barangAdd").val("");
      const hargaJ_barang = $("#hargaJ_barangAdd").val("0");
      kategori[0].selectize.clear();
      table.ajax.reload();
      modalAdd.hide();
    },
  });
});
let harga = "";

function formatH(value){
  const number = `${value}`.replace(/[^,\d]/,"")
  const sisa = number.length % 3
  const rupiah = number.substr(0,sisa)
  const ribuan = number.substr(sisa).match(/\d{3}/g)
  const join = ribuan == undefined ? rupiah : (rupiah ? rupiah +'.'+ribuan.join(".") : ribuan.join("."))
  return join
}

function changeKategori(e) {
  $("#hargaJ_barangAdd").focus();
  $("#hargaJ_barangAdd").select();
}
function changeKategoriEdit(e) {
  console.log("Ok");
  $("#hargaJ_barangEdit").focus();
}

$("#nama_barangAdd")
  .off("keydown")
  .on("keydown", function (e) {
    if (e.key == "Enter") {
      kategori[0].selectize.focus();
      console.log("Ok");
    }
  });
$("#hargaJ_barangAdd")
  .off("keydown")
  .on("keydown", function (e) {
    if (e.key == "Enter") {
      console.log("ok");
      $("#buttonAddBarang").click();
    }
  });
$("#hargaJ_barangEdit")
  .off("keydown")
  .on("keydown", function (e) {
    if (e.key == "Enter") {
      console.log("ok");
      $("#buttonEditBarang").click();
    }
  });

$("#nama_barangEdit")
  .off("keydown")
  .on("keydown", function (e) {
    if (e.key == "Enter") {
      kategoriEdit[0].selectize.focus();
    }
  });
$("#hargaJ_barangAdd").on("keyup", function (e) {
  formatInput(e, e.target.value);
});

$("#hargaJ_barangEdit").on("keyup", function (e) {
  formatInput(e, e.target.value);
});
