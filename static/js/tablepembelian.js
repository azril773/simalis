const editModal = document.querySelector("#modalEditPembelian");
const editModalIn = new bootstrap.Modal(editModal);
const token = document.querySelector("[name=csrfmiddlewaretoken]").value;
const modalEditT = new bootstrap.Modal("#modalEditTPembelian");
const modalAddT = new bootstrap.Modal("#modalAddTPembelian");
const posting = new bootstrap.Modal("#posting");
let idSelect = [];

$(window).on("keydown", function (e) {
  if (e.key == "Escape") {
    modalAddT.hide();
    editModalIn.hide();
  }

  // if click alt+a modal add show up
  if (e.altKey && e.key == "a") {
    modalAddT.show();
    // hide all modal
    editModalIn.hide();
    posting.hide();
    modalEditT.hide();
  }

  // if click alt+p modal posting show up
  if (e.altKey && e.key == "p") {
    posting.show();
    // hide all modal
    editModalIn.hide();
    modalAddT.hide();
    modalEditT.hide();
  }
});

const getTPembelian = () => {
  $.ajax({
    url: `${ip}/atk/getTPembelian/`,
    method: "post",
    headers: { "X-CSRFToken": token },
    success: (e) => {
      $(".count-tPembelian").html(e.data.length);
    },
  });
};
const table = new DataTable(".tablePembelian", {
  order: [[0, "desc"]],
  ajax: {
    url: `${ip}/atk/getPembelian/`,
    method: "post",
    headers: { "X-CSRFToken": token },
  },
  columns: [
    {
      data: "tgl_pembelian",
      render: function (data, type, row, meta) {
        const date = new Date(data).toLocaleDateString("id-ID", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        let split = date.split(" ");
        const pukul = split.indexOf("pukul");
        split.splice(pukul, 1);
        const time = `- ${split[split.length - 1].split(".").join(":")}`;
        split.pop();
        split.push(time);
        split = split.join(" ");
        return `<span>${split}</span>`;
      },
    },
    { data: "barang.nama_barang" },
    {
      data: "harga",
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
      data: "harga_jual",
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
    { data: "qty", 
      render:(d,t,r,m) => {
        const qty = formatHrg(d)
        return qty
      }
    },
    {
      data: "subTotal",
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
      data: "aksi",
      render: function (data, type, row, meta) {
        return `<span>
          <a href="" class="btn btn-primary editModalButton" data-bs-toggle="modal" data-bs-target="#modalEditPembelian" data-id="${data}">Edit</a>
        </span>`;
      },
    },
  ],
});

table.on("xhr", () => {
  getTPembelian();
});

const barangTAddSelectize = $("#barangAdd").selectize({
  maxOptions: 5,
  // create:true,
  onChange: changeBarangSelectize,
});

// function changeBarangAdd(e,i) {
//     console.log(e.getAttribute("data-harga"))
// }

const barangTEditSelectize = $("#barangTEdit").selectize({
  maxOptions: 5,
  onChange:function(e){
    $("#hargaTEdit").focus()
  }
});

const barangEdit = $("#barangEdit").selectize({
  maxOptions: 5,
  onChange:function(e){
    console.log("ok")
    $("#hargaEdit").focus()
  }
});

$("#modalAddTPembelian").on("show.bs.modal", function (e) {
  const date = moment().format("YYYY-MM-DD HH:mm");
  console.log(date);
  $("#tgl_beliAdd").val(date);

  
  setTimeout(() => {
    barangTAddSelectize[0].selectize.focus();
  }, 500);
});

// edit
$("table").click(function (e) {
  if (e.target.classList.contains("editModalButton")) {
    const date = moment().format("YYYY-MM-DDThh:mm");
    document.querySelector("#tgl_beliEdit").value = date;
    $("#tgl_beliEdit").val("");
    const id = e.target.getAttribute("data-id");
    $.ajax({
      url: `${ip}/atk/getPembelianById/`,
      method: "post",
      data: { id },
      headers: { "X-CSRFToken": token },
      success: (e) => {
        console.log(e);
        const date = moment(e.data.fields.tgl_beli).format("YYYY-MM-DDThh:mm");

        $("#tgl_beliEdit").val(date);
        $("#idEdit").val(id);
        barangEdit[0].selectize.setValue(e.data.fields.master_barang_id);
        let harga = parseInt(e.data.fields.harga)
          .toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          })
          .replace("Rp", " ")
          .trim()
          .split(",")[0];

        $("#hargaEdit").val(harga);
        let qty = parseInt(e.data.fields.qty)
          .toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          })
          .replace("Rp", " ")
          .trim()
          .split(",")[0];
        $("#qtyEdit").val(qty);
        //   setTimeout(() => {
        //       barangEdit[0].selectize.focus()
        //   },500);
        setTimeout(() => {
          $("#hargaEdit").focus();
          $("#hargaEdit").select();
        }, 500);
        $("#hargaEdit").on("keydown", function (e) {
          if (e.key == "Enter") {
            $("#qtyEdit").focus();
            $("#qtyEdit").select();
          }
        });

        $("#qtyEdit").on("keydown", function (e) {
          if (e.key == "Enter") {
            $("#editPembelian").click();
          }
        });
      },
    });
  }
});

// edit pemvelian post
$("#editPembelian").click(function (e) {
  const id = $("#idEdit").val();
  const date = $("#tgl_beliEdit").val();
  const barang = $("#barangEdit").val();
  const qty = $("#qtyEdit").val().split(".").join("");
  const harga = $("#hargaEdit").val().split(".").join("");
  $.ajax({
    url: `${ip}/atk/editPembelian/`,
    method: "post",
    data: { id, date, barang, harga, qty },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      editModalIn.hide();
      table.ajax.reload();
    },
    error: (err) => {
      if (err.responseJSON) {
        Swal.fire({
          icon: "error",
          title: "Error",
          html: err.responseJSON.message,
        });
      }
    },
  });
});

function changeBarangSelectize(id) {
  if (id == "") return;
  // const harga = $('option:selected', this).attr("data-harga")
  $.ajax({
    url: `${ip}/atk/getBarangById/`,
    method: "post",
    headers: { "X-CSRFToken": token },
    data: { id },
    success: (e) => {
      const harga = e.data.fields.harga;
      let format = parseInt(harga).toLocaleString("id-ID", {
        currency: "IDR",
        style: "currency",
      });
      if (!harga) {
        format = "Rp 0";
      }
      $(".hargaSeb").html(format);
      $("#hargaAdd").val(format.replace(/Rp/g,'').split(',')[0]);

      $("#hargaAdd").focus();
      setTimeout(() => {
        $("#hargaAdd").select();

      }, 100);
    },
  });
}

$("#hargaAdd")
  .off("keydown")
  .on("keydown", function (e) {
    if (e.key == "Enter") {
      setTimeout(() => {
        $("#qtyAdd").focus();
        $("#qtyAdd").select();
      }, 50);
    }
  });


$("#qtyAdd")
  .off("keydown")
  .on("keydown", function (e) {
    if (e.key == "Enter") {
      console.log("dalam");
      $("#addPembelian").click();
      return;
    }
  });
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const tableT = new DataTable(".tableTPembelian", {
  order: [[1, "desc"]],
  ajax: {
    url: `${ip}/atk/getTPembelian/`,
    method: "post",
    headers: { "X-CSRFToken": token },
  },
  columns: [
    {
      data: "aksi",
      render: (data, type, row, meta) => {
        return `<input type="checkbox" value=${data} name="checkBoxSelect">`;
      },
    },
    {
      data: "tPembelian.fields.tgl_beli",
      render: function (data, type, row, meta) {
        const date = new Date(data).toLocaleDateString("id-ID", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        let split = date.split(" ");
        const pukul = split.indexOf("pukul");
        split.splice(pukul, 1);
        const time = `- ${split[split.length - 1].split(".").join(":")}`;
        split.pop();
        split.push(time);
        split = split.join(" ");

        return `<span>${split}</span>`;
      },
    },
    { data: "barang.fields.barang" },
    {
      data: "tPembelian.fields.harga",
      render: function (data, type, row, meta) {
        const numberFormat = parseInt(data).toLocaleString("id-ID", {
          currency: "IDR",
          style: "currency",
        });
        return `<span>${numberFormat}</span>`;
      },
    },
    {
      data: "barang.fields.harga_jual",
      render: function (data, type, row, meta) {
        const numberFormat = parseInt(data).toLocaleString("id-ID", {
          currency: "IDR",
          style: "currency",
        });
        return `<span>${numberFormat}</span>`;
      },
    },
    { data: "tPembelian.fields.qty" },
    {
      data: "tPembelian.fields.subTotal",
      render: function (data, type, row, meta) {
        const numberFormat = parseInt(data).toLocaleString("id-ID", {
          currency: "IDR",
          style: "currency",
        });
        return `<b>${numberFormat}</b>`;
      },
    },
    {
      data: "aksi",
      render: function (data, type, row, meta) {
        return `<span class="flex gap-2">
        <a class="btn btn-primary editModalTButton" data-id="${data}">Edit</a>
        <a class="btn btn-danger deleteTButton" data-id="${data}">Delete</a>
        </span>`;
      },
    },
  ],
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$("#addPembelian").on("click", function (e) {
  const tgl_beli = $("#tgl_beliAdd").val();
  const date = new Date(tgl_beli).toLocaleDateString("id-ID", {
    day: "2-digit",
  month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const format = moment(date.split(",").join(""), "DD/MM/YYYY HH.mm.SS").format(
    "YYYY-MM-DD HH:mm:SS"
  );
  const barang = $("#barangAdd").val();
  console.log(barang);
  const harga = $("#hargaAdd").val().split(".").join("");
  const qty = $("#qtyAdd").val().split(".").join("");
  $.ajax({
    url: `${ip}/atk/tambahTPembelian/`,
    method: "post",
    data: { tgl_beli: format, barang, harga, qty },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      const qty = $("#qtyAdd").val("0");
      $("#hargaAdd").val("0")
      barangTAddSelectize[0].selectize.clear();
      tableT.ajax.reload();
      modalAddT.hide();
      getTPembelian();
    },
    error: (err) => {
      if (err.responseJSON) {
        Swal.fire({
          icon: "error",
          title: "Error",
          html: err.responseJSON.message,
        });
      }
    },
  });
});

tableT.on("click", "tbody tr", async (e) => {
  // if($(e.target).is("td>span>a.deleteTButton")){
  //   console.log()
  // }
  if (
    !$(e.target).is("input") &&
    !$(e.target).is("td>span>a.editModalTButton") &&
    !$(e.target).is("td>span>a.deleteTButton")
  ) {
    if ($(e.currentTarget).find("td:first").find("input").prop("checked")) {
      $(e.currentTarget).find("td:first").find("input").prop("checked", false);
    } else {
      $(e.currentTarget).find("td:first").find("input").prop("checked", true);
    }
  }
  // if($("[type=checkbox]",e.target))
  idSelect = [];
  $("[name=checkBoxSelect]:checked").each((i, el) => {
    idSelect.push($(el).val());
  });
});

$("#buttonPostAll").click(function (e) {
  idSelect = [];
  const select = $("table input[type=checkbox]").each((i, el) => {
    idSelect.push($(el).val());
  });
  postAjax(idSelect);
});

$("#buttonPostSelect").click(function (e) {
  postAjax(idSelect);
});

const postAjax = (id) => {
  $.ajax({
    url: `${ip}/atk/tambahPostPembelian/`,
    method: "post",
    data: { id: idSelect },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      table.ajax.reload();
      tableT.ajax.reload();
      posting.hide();
    },
    error: (err) => {
      if (err.responseJSON.message.length > 0) {
        let message = "";
        err.responseJSON.message.slice(0, 1).forEach((e) => {
          message += e + "<br>";
        });
        Swal.fire({
          icon: "error",
          title: "Error",
          html: message,
        });
      }
    },
  });
};

getTPembelian();

tableT.on("click", "tbody tr", async function (e) {
  const id = $(e.target).attr("data-id");
  if ($(e.target).is("td>span>a.editModalTButton")) {
    modalEditT.show();
    posting.hide();
    const data = await $.ajax({
      url: `${ip}/atk/getTPembelianById/`,
      method: "post",
      data: { id },
      headers: { "X-CSRFToken": token },
    });
    console.log(data);
    const date = moment(
      data.data.fields.tgl_beli,
      "YYYY-MM-DDTHH:mm:SSZ"
    ).format("YYYY-MM-DD HH:mm");
    $("#tgl_beliTEdit").val(date);
    barangTEditSelectize[0].selectize.setValue(
      data.data.fields.master_barang_id
    );
    const harga = parseInt(data.data.fields.harga)
      .toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
      })
      .replace("Rp", " ")
      .trim()
      .split(",")[0];
    $("#hargaTEdit").val(harga);
    setTimeout(() => {
      $("#hargaTEdit").focus();
      $("#hargaTEdit").select();
    }, 500);
    $("#hargaTEdit").on("keydown", function (e) {
      if (e.key == "Enter") {
        $("#qtyTEdit").focus();
        $("#qtyTEdit").select();
      }
    });
    $("#qtyTEdit").on("keydown", function (e) {
      if (e.key == "Enter") {
        $("#editTPembelian").click();
      }
    });
    const qty = parseInt(data.data.fields.qty)
      .toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
      })
      .replace("Rp", " ")
      .trim()
      .split(",")[0];
    $("#qtyTEdit").val(qty);
    $("#idTEdit").val(data.data.pk);
  } else if($(e.target).is("td>span>a.deleteTButton")) {
    $.ajax({
      url: `${ip}/atk/deleteTPembelian/`,
      method: "post",
      data: { id },
      headers: { "X-CSRFToken": token },
      success: (e) => {
        tableT.ajax.reload();
        getTPembelian();
      },
    });
  }
});

$("#editTPembelian").click(function () {
  const tgl_beli = $("#tgl_beliTEdit").val();
  const barang = $("#barangTEdit").val();
  const harga = $("#hargaTEdit").val().split(".").join("");
  const qty = $("#qtyTEdit").val().split(".").join("");
  const id = $("#idTEdit").val();
  console.log(barang, harga, tgl_beli, qty, id);
  $.ajax({
    url: `${ip}/atk/editTPembelian/`,
    method: "post",
    data: { id, qty, harga, barang, tgl_beli },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      // modalEdit.hide()
      posting.show();
      modalEditT.hide();
      tableT.ajax.reload();
    },
    error: (err) => {
      if (err.responseJSON) {
        Swal.fire({
          icon: "error",
          title: "Error",
          html: err.responseJSON.message,
        });
      }
    },
  });
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$("#modalEditTPembelian").on("hide.bs.modal", function (e) {
  posting.show();
});

$("#hargaAdd").on("keyup", function (e) {
  formatInput(e, $(e.target).val());
});


$("#hargaEdit").on("keyup", function (e) {
  console.log(e.target.value);
  formatInput(e, e.target.value);
});


$("#hargaTEdit").on("keyup", function (e) {
  formatInput(e, $(e.target).val());
});


$("#qtyAdd").on("keyup", function (e) {
  formatInput(e, $(e.target).val());
});

$("#qtyEdit").on("keyup", function (e) {
  formatInput(e, $(e.target).val());
});

$("#qtyTEdit").on("keyup", function (e) {
  formatInput(e, $(e.target).val());
});
// $("#dateRangePembelian").daterangepicker()

// $("#dateRangePembelian").on("apply.daterangepicker", function (e) {
//     const split = $("#dateRangePembelian").val().split("-")
//     const start = moment(split[0].trim(), "MM/DD/YYYY").format("YYYY-MM-DD 00:00:00")
//     const end = moment(split[1].trim(), "MM/DD/YYYY").format("YYYY-MM-DD 23:59:59")

//     $(".tablePembelian").DataTable().destroy()
//     new DataTable(".tablePembelian")
// })
