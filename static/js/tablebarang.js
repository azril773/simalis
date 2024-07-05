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
    { data: "kategori" },
    { data: "stok" },
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
        $("#harga_barangEdit").val(e.data.fields.harga);
        $("#idEdit").val(e.data.pk);
        // $("#kategori_barang").html(""/)
        kategoriEdit[0].selectize.setValue(e.data.fields.kategori_id);
      },
    });
  }
});

$("#buttonEditBarang").click(function (e) {
  const nama_barang = $("#nama_barangEdit").val();
  const harga_barang = $("#harga_barangEdit").val();
  const kategori = $("#kategoriEdit").val();
  const id = $("#idEdit").val();
  console.log(id);
  $.ajax({
    url: `${ip}/atk/editBarang/`,
    type: "post",
    data: { id, nama_barang, harga_barang, kategori },
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
  const harga_barang = $("#harga_barangAdd").val().split(".").join("");
  const kategori = $("#kategoriAdd").val();
  console.log(harga_barang);
  $.ajax({
    url: `${ip}/atk/tambahBarang/`,
    type: "post",
    data: { nama_barang, harga_barang, kategori },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      table.ajax.reload();
      modalAdd.hide();
    },
  });
});
let harga = "";
$("#buttonAddModal").click(function (e) {
  const nama_barang = $("#nama_barangAdd").val("");
  const harga_barang = $("#harga_barangAdd").val("");
  kategori[0].selectize.clear();

  harga = "";
});

function changeKategori(e) {
  $("#harga_barangAdd").focus();
}
function changeKategoriEdit(e) {
  console.log("Ok");
  $("#buttonEditBarang").click();
}

$("#nama_barangAdd")
  .off("keydown")
  .on("keydown", function (e) {
    if (e.key == "Enter") {
      kategori[0].selectize.focus();
      console.log("Ok");
    }
  });

$("#harga_barangAdd")
  .off("keydown")
  .on("keydown", function (e) {
    if (e.key == "Enter") {
      console.log("ok");
      $("#buttonAddBarang").click();
    }
  });

$("#nama_barangEdit")
  .off("keydown")
  .on("keydown", function (e) {
    if (e.key == "Enter") {
      kategoriEdit[0].selectize.focus();
    }
  });

$("#harga_barangAdd").on("keyup", function (e) {
  formatInput(e, e.target.value);
});
