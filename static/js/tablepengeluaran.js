const editModal = document.querySelector("#modalEditPengeluaran");
const editModalIn = new bootstrap.Modal(editModal);
const modalTEdit = new bootstrap.Modal("#modalEditTPengeluaran");
const modalAdd = new bootstrap.Modal("#modalAddTPengeluaran");
const posting = new bootstrap.Modal("#posting");
const token = document.querySelector("[name=csrfmiddlewaretoken]").value;
let selectPerson = false
let selectPersonEdit = false
let selectPersonTEdit = false
let harga_jual = 0
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
    url: `/atk/getTPengeluaran/`,
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
    url: `/atk/getPengeluaran/`,
    method: "post",
    headers: { "X-CSRFToken": token },
  },
  columns: [
    {
      data: "tgl_pengeluaran",
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
      data: "barang.harga",
      render: function (data, type, row, meta) {
        const numberFormat = parseInt(data).toLocaleString("id-ID", {
          currency: "IDR",
          style: "currency",
        });
        return `<span class="w-full"><p class="text-end">${numberFormat}</p></span>`;
      },
    },
    {
      data: "harga_jual",
      render: function (data, type, row, meta) {
        const numberFormat = parseInt(data).toLocaleString("id-ID", {
          currency: "IDR",
          style: "currency",
        });
        return `<span class="w-full"><p class="text-end">${numberFormat}</p></span>`;
      },
    },
    { data: "kategori" },
    {
      data: "counter",
    },
    {
      data: "divisi",
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
    {data:"qty",
      render:(d,t,r,m) => {
        return formatHrg(d)
      }
    },
    {data:'status',
      render:(data,type,row,meta) => {
        let render = ''
        if(data == 0){
          render = `<span>Non Bayar</span>`
        }else if(data ==1){
          render = `<span>Bayar Cash</span>`
        }else{
          render = `<span>Potong Faktur</span>`
        }
        return render
      }
    },
    {
      data: "aksi",
      render: function (data, type, row, meta) {
        return `<a href="" class="btn btn-primary editModalButton" data-bs-toggle="modal" data-bs-target="#modalEditPengeluaran" data-id="${data}">Edit</a>`;
      },
    },
  ],
  scrollX:true,
  destroy: true,
  ordering: false,
  paging: false,
  scrollX:"100%",
  scrollY: 300,
  processing: true,
});

const tableT = new DataTable(".tableTPengeluaran", {
  order: [[1, "desc"]],
  ajax: {
    url: `/atk/getTPengeluaran/`,
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
      data: "barang.fields.harga_jual",
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
      data: "divisi.fields.divisi",
    },
    {
      data: "person.fields.nama",
      render: (data, type, row, meta) => {
        if (data) {
          return `<span>${data}</span>`;
        } else {
          return `<span>-</span>`;
        }
      },
    },
    {
      data: "tPengeluaran.fields.qty",
      render:(d,t,r,m) => {
        return formatHrg(d)
      }
    },
    {data:'tPengeluaran.fields.status',
      render:(data,type,row,meta) => {
        let render = ''
        if(data == 0){
          render = `<span>Non Bayar</span>`
        }else if(data == 1){
          render = `<span>Bayar</span>`
        }else{
          render = `<span>Potong Faktur</span>`
          
        }
        return render
      }
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

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const statusAddSelectize = $("#statusAdd").selectize({
  onChange: function(e){
    if(harga_jual > 0){
      $("#qtyAdd").focus();
      $("#qtyAdd").select();
    }
  },
});

const barangAddSelectize = $("#barangAdd").selectize({
  onChange: function (e) {
    $.ajax({
      url:`/atk/getBarangById/`,
      method:"post",
      data:{id:e},
      headers:{"X-CSRFToken":token},
      success(e){
        if(e.data.fields.harga_jual <= 0){
          statusAddSelectize[0].selectize.setValue("0")
          statusAddSelectize[0].selectize.disable()
        }else{
          statusAddSelectize[0].selectize.enable()
          statusAddSelectize[0].selectize.clear()
          harga_jual = e.data.fields.harga_jual
        }
      }
    })
    counterAddSelectize[0].selectize.focus();
  },
});

const divisiAddSelectize = $("#divisiAdd").selectize({
  disabledField:'disabled'
})
divisiAddSelectize[0].selectize.disable()

const counterAddSelectize = $("#counterAdd").selectize({
  onChange: counterChangeAdd
});

const personAddSelectize = $("#personAdd").selectize({
  onChange: personChangeAdd,
});


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const barangTEditSelectize = $("#barangTEdit").selectize({
  onChange:function(e){
    counterTEditSelectize[0].selectize.focus()
  }
});

const counterTEditSelectize = $("#counterTEdit").selectize({
  onChange:counterChangeTEdit
});

const divisiTEditSelectize = $("#divisiTEdit").selectize({
});

divisiTEditSelectize[0].selectize.disable()

const personTEditSelectize = $("#personTEdit").selectize({
  onChange: personChangeTEdit,
});

const statusTEditSelectize = $("#statusTEdit").selectize({
  onChange: function(e){
    $("#qtyTEdit").focus();
    $("#qtyTEdit").select();
  },
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const barangEditSelectize = $("#barangEdit").selectize({
  onChange:function(e){
    counterEditSelectize[0].selectize.focus()
  }
});

const counterEditSelectize = $("#counterEdit").selectize({
  onChange:counterChangeEdit
});

const divisiEditSelectize = $("#divisiEdit").selectize({
});

divisiEditSelectize[0].selectize.disable()

const personEditSelectize = $("#personEdit").selectize({
  onChange: personChangeEdit,
});

const statusEditSelectize = $("#statusEdit").selectize({
  onChange: function(e){
    $("#qtyEdit").focus();
    $("#qtyEdit").select();
  },
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++




function personChangeEdit(id) {
  const person = personEditSelectize[0].selectize;
  const counter = counterEditSelectize[0].selectize;
  const divisi = divisiEditSelectize[0].selectize;
  let option;
  counter.disable();
  if (id == "") {
    selectPersonEdit = false
    counter.enable();
    counter.clear();
    divisi.clear();
    return;
  }
  $.ajax({
    url: `/atk/getPersonById/`,
    method: "post",
    data: { id },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      selectPersonEdit = true
      console.log(e.data)
      counter.setValue(e.data[0].fields.counter_bagian_id);
      divisi.setValue(e.data[1].fields.divisi);
      statusEditSelectize[0].selectize.focus()
    },
  });
}
function counterChangeAdd(id) {
  if(!selectPerson){
    const counter = counterAddSelectize[0].selectize;
    const divisi = divisiAddSelectize[0].selectize;
    let option;
    if (id == "") {
      divisi.clear();
      return;
    }
    $.ajax({
      url: `/atk/getCounterById/`,
      method: "post",
      data: { id },
      headers: { "X-CSRFToken": token },
      success: (e) => {
        divisi.setValue(e.data.fields.divisi);
        personAddSelectize[0].selectize.focus()
      },
    });
  }
}
function counterChangeEdit(id) {
  if(!selectPersonEdit){
    const counter = counterEditSelectize[0].selectize;
    const divisi = divisiEditSelectize[0].selectize;
    let option;
    if (id == "") {
      divisi.clear();
      return;
    }
    $.ajax({
      url: `/atk/getCounterById/`,
      method: "post",
      data: { id },
      headers: { "X-CSRFToken": token },
      success: (e) => {
        divisi.setValue(e.data.fields.divisi);
        personEditSelectize[0].selectize.focus()
      },
    });
  }
}
function counterChangeTEdit(id) {
  if(!selectPersonTEdit){
    const counter = counterTEditSelectize[0].selectize;
    const divisi = divisiTEditSelectize[0].selectize;
    let option;
    if (id == "") {
      divisi.clear();
      return;
    }
    $.ajax({
      url: `/atk/getCounterById/`,
      method: "post",
      data: { id },
      headers: { "X-CSRFToken": token },
      success: (e) => {
        divisi.setValue(e.data.fields.divisi);
        personTEditSelectize[0].selectize.focus()
      },
    });
  }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++




// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$("table").click(function (e) {
  if (e.target.classList.contains("editModalButton")) {
    const date = moment().format("YYYY-MM-DDThh:mm");
    barangEditSelectize[0].selectize.disable();
    const tgl_keluar = $("#tgl_keluarEdit").val("");
    const barang = barangEditSelectize[0].selectize;
    const counter = counterEditSelectize[0].selectize;
    const person = personEditSelectize[0].selectize;
    const divisi = divisiEditSelectize[0].selectize;
    const status = statusEditSelectize[0].selectize;
    const qty = $("#qtyEdit").val("");
    $("#tgl_keluarEdit").val("");
    const id = e.target.getAttribute("data-id");
    $.ajax({
      url: `/atk/getPengeluaranById/`,
      method: "post",
      data: { id },
      headers: { "X-CSRFToken": token },
      success: (e) => {
        const date = moment(e.data.fields.tgl_keluar).format(
          "YYYY-MM-DDThh:mm"
        );
        person.setValue(e.data.fields.personal_id);
        counter.setValue(e.data.fields.counter_id);
        barang.setValue(e.data.fields.master_barang_id);
        divisi.setValue(e.data.fields.divisi);
        status.setValue(e.data.fields.status)
        $("#tgl_keluarEdit").val(date);
        $("#qtyEdit").val(e.data.fields.qty);
        $("#idEdit").val(e.data.pk);
        setTimeout(() => {
          $("#qtyEdit").focus();
          $("#qtyEdit").select();
        }, 500);
      },
      error: (err) => {
      },
    });
  }
});

tableT.on("click", "tbody tr", (e) => {
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

$("#modalAddTPengeluaran").on("show.bs.modal",function (e) {
  const date = moment().format("YYYY-MM-DD HH:mm");
  $("#tgl_keluarAdd").val(date);
  barangAddSelectize[0].selectize.clear();
  setTimeout(() => {
    barangAddSelectize[0].selectize.focus();
  }, 500);
  personAddSelectize[0].selectize.clear();
  counterAddSelectize[0].selectize.clear();
  statusAddSelectize[0].selectize.clear();
  
  $("#divisiAdd").val("");
});

$(".tableTPengeluaran").on("click", "tbody tr", function (e) {
  e.preventDefault()
  const id = $(e.target).attr("data-id");
  const counter = counterTEditSelectize[0].selectize;
  const person = personTEditSelectize[0].selectize;
  const divisi = divisiTEditSelectize[0].selectize;
  const barang = barangTEditSelectize[0].selectize;
  if ($(e.target).is("span>a.editTModalButton")) {
    $.ajax({
      url: `/atk/getTPengeluaranById/`,
      method: "post",
      data: { id },
      headers: { "X-CSRFToken": token },
      success: (e) => {
        const date = moment(e.data.fields.tgl_keluar).format(
          "YYYY-MM-DDThh:mm"
        );
        counter.setValue(e.data.fields.counter_id);
        person.setValue(e.data.fields.personal_id);
        divisi.setValue(e.data.fields.divisi);
        barang.setValue(e.data.fields.master_barang_id);
        $("#tgl_keluarTEdit").val(date);
        $("#qtyTEdit").val(e.data.fields.qty);
        $("#idTEdit").val(e.data.pk);
        console.log(e.data)
        statusTEditSelectize[0].selectize.setValue(e.data.fields.status);
        setTimeout(() => {
          $("#qtyTEdit").focus();
          $("#qtyTEdit").select();
        }, 500);
      },
    });
  }else if($(e.target).is("span>a.deleteTButton")){
    $.ajax({
      url: `/atk/deleteTPengeluaran/`,
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





// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$("#editPengeluaran").click(function (e) {
  const id = $("#idEdit").val();
  const tgl_keluar = $("#tgl_keluarEdit").val();
  const barang = $("#barangEdit").val();
  const counter = $("#counterEdit").val();
  const divisi = $("#divisiEdit").val();
  const person = $("#personEdit").val();
  const qty = $("#qtyEdit").val().split(".").join("");
  const status = $("#statusEdit").val();
  $.ajax({
    url: `/atk/editPengeluaran/`,
    method: "post",
    data: { id, tgl_keluar, barang, counter,divisi, person, qty,status },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      selectPersonEdit = false
      editModalIn.hide();
      table.ajax.reload();
    },
    error: (err) => {
      $(".msg").html("")
      $(".msg").append(`
          <span class="alert alert-danger">${err.responseJSON.message}!</span>
        `);
      editModalIn.hide();
    },
  });
});


$("#addPengeluaran").click(function (e) {
  const tgl_keluar = $("#tgl_keluarAdd").val();
  const barang = $("#barangAdd").val();
  const counter = $("#counterAdd").val();
  const divisi = $("#divisiAdd").val();
  const person = $("#personAdd").val();
  const qty = $("#qtyAdd").val().split(".").join("")
  const status = $("#statusAdd").val();

  $.ajax({
    url: `/atk/tambahTPengeluaran/`,
    method: "post",
    data: { tgl_keluar, counter,divisi, barang, qty, person,status },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      modalAdd.hide();
      tableT.ajax.reload();
      const tgl_beli = $("#tgl_beliAdd").val("");
      const harga = $("#hargaAdd").val("");
      barangAddSelectize[0].selectize.clear();
      counterAddSelectize[0].selectize.clear();
      personAddSelectize[0].selectize.clear();
      const qty = $("#qtyAdd").val("0");
      selectPerson = false
      getTPengeluaran();
      $(".msg span").remove()
    },
    error:(err) => {
      if(err.responseJSON){
        $(".msg span").remove()
        $(".msg").append(`
          <span class="alert alert-danger">${err.responseJSON?.message}!</span>
        `);
      modalAdd.hide();
      }
    }
  });
});

$("#editTPengeluaran").click(function (e) {
  const id = $("#idTEdit").val();
  const tgl_keluar = $("#tgl_keluarTEdit").val();
  const barang = $("#barangTEdit").val();
  const counter = $("#counterTEdit").val();
  const divisi = $("#divisiTEdit").val();
  const person = $("#personTEdit").val();
  const status = $("#statusTEdit").val();
  const qty = $("#qtyTEdit").val().split(".").join("")
  $.ajax({
    url: `/atk/editTPengeluaran/`,
    method: "post",
    data: { id, qty, tgl_keluar, barang, counter,divisi, person,status },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      selectPersonTEdit = false
      modalTEdit.hide();
      tableT.ajax.reload();
      $(".msg span").remove()
    },
    error:(err) => {
      if(err.responseJSON){
        $(".msg span").remove()
        $(".msg").append(`
          <span class="alert alert-danger">${err.responseJSON?.message}!</span>
        `);
      modalTEdit.hide();
      setTimeout(() => {
        posting.hide()
      }, 500);
      }
    }
  });
});
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// pertama



$("#modalEditTPengeluaran").on("hide.bs.modal", function (e) {
  posting.show();
});

$("#buttonPostSelect").click(function (e) {
  postAjax(idSelect);
});

const postAjax = (id) => {
  $.ajax({
    url: `/atk/tambahPostPengeluaran/`,
    method: "post",
    data: { id: idSelect },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      table.ajax.reload();
      tableT.ajax.reload();
      posting.hide();
      getTPengeluaran();
      $("#msg div").remove();
    },
    error: (err) => {
      table.ajax.reload();
      tableT.ajax.reload();
      $("#msg div").remove();
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
  const counter = counterAddSelectize[0].selectize;
  const person = personAddSelectize[0].selectize;
  const divisi = divisiAddSelectize[0].selectize;
  let option;
  counter.clear();
  if (id == "") {
      selectPerson = false
    counter.clear();
    counter.enable();
    divisi.clear();
    return;
  }
  $.ajax({
    url: `/atk/getPersonById/`,
    method: "post",
    data: { id },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      selectPerson = true
      counter.setValue(e.data[0].fields.counter_bagian_id);
      divisi.setValue(e.data[1].fields.divisi)
      counter.disable();
      divisi.disable();
      setTimeout(() => {
        person.disable()
        person.enable();
        if(harga_jual <= 0){
          $("#qtyAdd").focus()
          $("#qtyAdd").select()
        }else{
          statusAddSelectize[0].selectize.focus()
        }
      }, 20);
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
$("#qtyEdit")
  .on("focus",function(e){
    $("#qtyEdit").select()
  })

function personChangeTEdit(id) {
  const counter = counterTEditSelectize[0].selectize;
  const person = personTEditSelectize[0].selectize;
  const divisi = divisiTEditSelectize[0].selectize;
  let option;
  counter.clear();
  if (id == "") {
      selectPersonTEdit = false
    counter.clear();
    divisi.clear();
    counter.enable();
    return;
  }
  $.ajax({
    url: `/atk/getPersonById/`,
    method: "post",
    data: { id },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      selectPersonTEdit = true
      counter.setValue(e.data[0].fields.counter_bagian_id);
      divisi.setValue(e.data[1].fields.divisi);
      counter.disable();
      statusTEditSelectize[0].selectize.focus()
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

$("#qtyEdit").on("keyup",function(e){
  formatInput(e,$(e.target).val())
})
$("#qtyTEdit").on("keyup",function(e){
  formatInput(e,$(e.target).val())
})
$("#qtyAdd").on("keyup",function(e){
  formatInput(e,$(e.target).val())
})
getTPengeluaran();
