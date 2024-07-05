const editModal = document.querySelector("#modalEditPengeluaran");
const editModalIn = new bootstrap.Modal(editModal);
const modalTEdit = new bootstrap.Modal("#modalEditTPengeluaran");
const modalAdd = new bootstrap.Modal("#modalAddTPengeluaran");
const posting = new bootstrap.Modal("#posting");
const token = document.querySelector("[name=csrfmiddlewaretoken]").value;

$(window).on("keydown", function (e) {
  // if click alt+a modal add show up
  if (e.altKey && e.key == "a") {
    modalAdd.show();
    // hide all modal
    editModalIn.hide();
    posting.hide();
    modalTEdit.hide();
  }

  // if click alt+p modal posting show up
  if (e.altKey && e.key == "p") {
    posting.show();
    // hide all modal
    editModalIn.hide();
    modalAdd.hide();
    modalTEdit.hide();
  }
});

let idSelect = [];

const getTPengeluaran = () => {
  $.ajax({
    url: `${ip}/atk/getTPengeluaran/`,
    method: "post",
    headers: { "X-CSRFToken": token },
    success: (e) => {
      $(".count-tPengeluaran").html(e.data.length);
    },
  });
};

const table = new DataTable(".tablePengeluaran", {
  order: [[0, "desc"]],
  ajax: {
    url: `${ip}/atk/getPengeluaran/`,
    method: "post",
    headers: { "X-CSRFToken": token },
  },
  columns: [
    {
      data: "tgl_pengeluaran",
      render: function (data, type, row, meta) {
        console.log(data);
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
      data: "barang.harga",
      render: function (data, type, row, meta) {
        console.log(data);
        const numberFormat = parseInt(data).toLocaleString("id-ID", {
          currency: "IDR",
          style: "currency",
        });
        return `<span>${numberFormat}</span>`;
      },
    },
    { data: "kategori" },
    {
      data: "counter",
    },
    {
      data: "person",
      render: function (data, type, row, meta) {
        if (data) {
          return `<span>${data}</span>`;
        } else {
          return `<span>-</span>`;
        }
      },
    },
    { data: "qty" },
    {
      data: "aksi",
      render: function (data, type, row, meta) {
        return `<a href="" class="btn btn-primary editModalButton" data-bs-toggle="modal" data-bs-target="#modalEditPengeluaran" data-id="${data}">Edit</a>`;
      },
    },
  ],
});

const tableT = new DataTable(".tableTPengeluaran", {
  order: [[1, "desc"]],
  ajax: {
    url: `${ip}/atk/getTPengeluaran/`,
    type: "post",
    headers: { "X-CSRFToken": token },
  },
  columns: [
    {
      data: "aksi",
      render: (data, row, type, meta) => {
        return `<input type="checkbox" name="checkBoxSelect" value=${data}>`;
      },
    },
    {
      data: "tPengeluaran.fields.tgl_keluar",
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
    {
      data: "barang.fields.barang",
    },
    {
      data: "barang.fields.harga",
      render: function (data, type, row, meta) {
        const numberFormat = parseInt(data).toLocaleString("id-ID", {
          currency: "IDR",
          style: "currency",
        });
        return `<span>${numberFormat}</span>`;
      },
    },
    {
      data: "counter.fields.counter_bagian",
    },
    {
      data: "person.fields.nama",
      render: (data, type, row, meta) => {
        console.log(data);
        if (data) {
          return `<span>${data}</span>`;
        } else {
          return `<span>-</span>`;
        }
      },
    },
    {
      data: "tPengeluaran.fields.qty",
    },
    {
      data: "aksi",
      render: function (data, type, row, meta) {
        return `<span class="flex gap-2">
        <a href="" class="btn btn-primary editTModalButton" data-bs-toggle="modal" data-bs-target="#modalEditTPengeluaran" data-id="${data}">Edit</a>
        <a href="" class="btn btn-danger deleteTButton" data-id="${data}">Delete</a>
        </span>`;
      },
    },
  ],
});

const barangAddSelectize = $("#barangAdd").selectize({
  maxOptions: 5,
  onChange: function (e) {
    counterAddSelectize[0].selectize.focus();
  },
});

const counterAddSelectize = $("#counterAdd").selectize({
  maxOptions: 5,
  onChange: function (e) {
    personAddSelectize[0].selectize.focus();
  },
});

const personAddSelectize = $("#personAdd").selectize({
  maxOptions: 5,
  onChange: personChangeAdd,
});

const barangTEditSelectize = $("#barangTEdit").selectize({
  maxOptions: 5,
});

const counterTEditSelectize = $("#counterTEdit").selectize({
  maxOptions: 5,
});

const personTEditSelectize = $("#personTEdit").selectize({
  maxOptions: 5,
  onChange: personChangeTEdit,
});

const barangEditSelectize = $("#barangEdit").selectize({
  maxOptions: 5,
});

const counterEditSelectize = $("#counterEdit").selectize({
  maxOptions: 5,
});

const personEditSelectize = $("#personEdit").selectize({
  maxOptions: 5,
  onChange: personChangeEdit,
});

function personChangeEdit(id) {
  const person = personEditSelectize[0].selectize;
  const counter = counterEditSelectize[0].selectize;
  let option;
  counter.disable();
  if (id == "") {
    counter.enable();
    counter.clear();
    return;
  }
  $.ajax({
    url: `${ip}/atk/getPersonById/`,
    method: "post",
    data: { id },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      counter.setValue(e.data.fields.counter_bagian_id);
    },
  });
}

$("table").click(function (e) {
  if (e.target.classList.contains("editModalButton")) {
    const date = moment().format("YYYY-MM-DDThh:mm");
    barangEditSelectize[0].selectize.disable();
    const tgl_keluar = $("#tgl_keluarEdit").val("");
    const barang = barangEditSelectize[0].selectize;
    const counter = counterEditSelectize[0].selectize;
    const person = personEditSelectize[0].selectize;
    const qty = $("#qtyEdit").val("");
    $("#tgl_keluarEdit").val("");
    const id = e.target.getAttribute("data-id");
    $.ajax({
      url: `${ip}/atk/getPengeluaranById/`,
      method: "post",
      data: { id },
      headers: { "X-CSRFToken": token },
      success: (e) => {
        console.log(e);
        const date = moment(e.data.fields.tgl_keluar).format(
          "YYYY-MM-DDThh:mm"
        );
        person.setValue(e.data.fields.personal_id);
        counter.setValue(e.data.fields.counter_id);
        barang.setValue(e.data.fields.master_barang_id);
        $("#tgl_keluarEdit").val(date);
        $("#qtyEdit").val(e.data.fields.qty);
        $("#idEdit").val(e.data.pk);
        setTimeout(() => {
          $("#qtyEdit").focus();
        }, 500);
      },
      error: (err) => {
        console.log(err.message);
      },
    });
  }
});

$("#editPengeluaran").click(function (e) {
  const id = $("#idEdit").val();
  const tgl_keluar = $("#tgl_keluarEdit").val();
  const barang = $("#barangEdit").val();
  const counter = $("#counterEdit").val();
  const person = $("#personEdit").val();
  const qty = $("#qtyEdit").val();
  $.ajax({
    url: `${ip}/atk/editPengeluaran/`,
    method: "post",
    data: { id, tgl_keluar, barang, counter, person, qty },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      editModalIn.hide();
      table.ajax.reload();
    },
    error: (err) => {
      $(".msg").append(`
          <span class="alert alert-danger">${err.responseJSON.message}!</span>
        `);
      editModalIn.hide();
    },
  });
});
// pertama
$("#modalAddTPengeluaran").on("show.bs.modal",function (e) {
  const date = moment().format("YYYY-MM-DD HH:mm");
  console.log(date);
  $("#tgl_keluarAdd").val(date);
  barangAddSelectize[0].selectize.clear();
  setTimeout(() => {
    barangAddSelectize[0].selectize.focus();
  }, 500);
  personAddSelectize[0].selectize.clear();
  counterAddSelectize[0].selectize.clear();
  $("#qtyAdd").val("");
});

$("#addPengeluaran").click(function (e) {
  const tgl_keluar = $("#tgl_keluarAdd").val();
  const barang = $("#barangAdd").val();
  const counter = $("#counterAdd").val();
  const person = $("#personAdd").val();
  const qty = $("#qtyAdd").val();

  $.ajax({
    url: `${ip}/atk/tambahTPengeluaran/`,
    method: "post",
    data: { tgl_keluar, counter, barang, qty, person },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      modalAdd.hide();
      tableT.ajax.reload();
      const tgl_beli = $("#tgl_beliAdd").val("");
      const harga = $("#hargaAdd").val("");
      barangAddSelectize[0].selectize.clear();
      counterAddSelectize[0].selectize.clear();
      personAddSelectize[0].selectize.clear();
      const qty = $("#qtyAdd").val("");
      getTPengeluaran();
    },
    error:(err) => {
      if(err.responseJSON){
        $(".msg").append(`
          <span class="alert alert-danger">${err.responseJSON?.message}!</span>
        `);
      modalAdd.hide();
      }
    }
  });
});

tableT.on("click", "tbody tr", (e) => {
  console.log($(e.target).is("td>a"));
  if (!$(e.target).is("input") && !$(e.target).is("td>span>a.editTModalButton") && !$(e.target).is("td>span>a.deleteTButton")) {
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

$(".tableTPengeluaran").on("click", "tbody tr", function (e) {
  e.preventDefault()
  const id = $(e.target).attr("data-id");
  console.log(id);
  const counter = counterTEditSelectize[0].selectize;
  const person = personTEditSelectize[0].selectize;
  const barang = barangTEditSelectize[0].selectize;
  if ($(e.target).is("span>a.editTModalButton")) {
    $.ajax({
      url: `${ip}/atk/getTPengeluaranById/`,
      method: "post",
      data: { id },
      headers: { "X-CSRFToken": token },
      success: (e) => {
        const date = moment(e.data.fields.tgl_keluar).format(
          "YYYY-MM-DDThh:mm"
        );
        if (e.data.fields.personal_id != "") {
          counter.setValue(e.data.fields.counter_id);
          counter.disable();
        } else {
          counter.setValue(e.data.fields.counter_id);
        }
        person.setValue(e.data.fields.personal_id);
        barang.setValue(e.data.fields.master_barang_id);
        $("#tgl_keluarTEdit").val(date);
        $("#qtyTEdit").val(e.data.fields.qty);
        $("#idTEdit").val(e.data.pk);
        setTimeout(() => {
          $("#qtyTEdit").focus();
        }, 500);
      },
    });
  }else{
    $.ajax({
      url: `${ip}/atk/deleteTPengeluaran/`,
      method: "post",
      data: { id },
      headers: { "X-CSRFToken": token },
      success: (e) => {
        tableT.ajax.reload()
        getTPengeluaran()
      },
    });
  }
});

$("#editTPengeluaran").click(function (e) {
  const id = $("#idTEdit").val();
  const tgl_keluar = $("#tgl_keluarTEdit").val();
  const barang = $("#barangTEdit").val();
  const counter = $("#counterTEdit").val();
  const person = $("#personTEdit").val();
  const qty = $("#qtyTEdit").val();
  $.ajax({
    url: `${ip}/atk/editTPengeluaran/`,
    method: "post",
    data: { id, qty, tgl_keluar, barang, counter, person },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      modalTEdit.hide();
      tableT.ajax.reload();
    },
    error:(err) => {
      if(err.responseJSON){
        $(".msg").append(`
          <span class="alert alert-danger">${err.responseJSON?.message}!</span>
        `);
      modalTEdit.hide();
      posting.hide()
      }
    }
  });
});

$("#modalEditTPengeluaran").on("hide.bs.modal", function (e) {
  posting.show();
});

$("#buttonPostSelect").click(function (e) {
  postAjax(idSelect);
});

const postAjax = (id) => {
  $.ajax({
    url: `${ip}/atk/tambahPostPengeluaran/`,
    method: "post",
    data: { id: idSelect },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      table.ajax.reload();
      tableT.ajax.reload();
      posting.hide();
      getTPengeluaran();
    },
    error: (err) => {
      table.ajax.reload();
      tableT.ajax.reload();
      $("#msg").html("");
      err.responseJSON.message.slice(0, 1).forEach((e) => {
        $("#msg").append(`<li class="alert alert-danger">${e}</li>`);
      });
    },
  });
};

$("#buttonPostAll").click(function (e) {
  idSelect = [];
  const select = $("table input[type=checkbox]").each((i, el) => {
    idSelect.push($(el).val());
  });
  postAjax(idSelect);
});

function personChangeAdd(id) {
  console.log(id);
  const counter = counterAddSelectize[0].selectize;
  const person = personAddSelectize[0].selectize;
  let option;
  counter.clear();
  if (id == "") {
    counter.clear();
    counter.enable();
    return;
  }
  $.ajax({
    url: `${ip}/atk/getPersonById/`,
    method: "post",
    data: { id },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      counter.setValue(e.data.fields.counter_bagian_id);
      counter.disable();
      person.enable();
      $("#qtyAdd").focus();
    },
  });
}

$("#qtyAdd")
  .off("keydown")
  .on("keydown", function (e) {
    if (e.key == "Enter") {
      $("#addPengeluaran").click();
    }
  });

$("#qtyTEdit")
  .off("keydown")
  .on("keydown", function (e) {
    if (e.key == "Enter") {
      $("#editTPengeluaran").click();
    }
  });

$("#qtyEdit")
  .off("keydown")
  .on("keydown", function (e) {
    if (e.key == "Enter") {
      $("#editPengeluaran").click();
    }
  });

function personChangeTEdit(id) {
  console.log(id);
  const counter = counterTEditSelectize[0].selectize;
  const person = personTEditSelectize[0].selectize;
  let option;
  counter.clear();
  if (id == "") {
    counter.clear();
    counter.enable();
    return;
  }
  $.ajax({
    url: `${ip}/atk/getPersonById/`,
    method: "post",
    data: { id },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      counter.setValue(e.data.fields.counter_bagian_id);
      counter.disable();
    },
  });
}

// if (tgl_keluar == "" || counter == "" || barang == "" || qty == "") {
//   $(".msgModalTambah").html(`
//             <div class="alert alert-danger" role="alert">
//                 Form tidak boleh kosong!
//             </div>
//         `);
//   return false;
// }
getTPengeluaran();
