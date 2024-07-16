// initialize id counterTabel with datatable
// get token
const token = document.querySelector("[name=csrfmiddlewaretoken]").value;
const addModal = new bootstrap.Modal("#addModalDivisi");
const editModal = new bootstrap.Modal("#editModalDivisi");
const divisiTabel = new DataTable("#divisiTable", {
  responsive: true,
  ajax: {
    url: `${ip}/atk/getDivisi/`,
    method: "post",
    headers: { "X-CSRFToken": token },
  },
  columns: [
    { data: "divisi" },
    {
      data: "status",
      render: (data, type, row, meta) => {
        if (data == "AC") {
          return `<span class="badge bg-success">Active</span>`;
        } else {
          return `<span class="badge bg-danger">Deactive</span>`;
        }
      },
    },
    {
      data: "pk",
      render: (data, type, row, meta) => {
        return `<button href="" class="btn btn-primary" id="buttonEditModal" data-id="${data}" data-bs-toggle="modal" data-bs-target="#editModalDivisi">Edit</button>`;
      },
    },
  ],
});

const selectStatusEdit = $("#statusEdit").selectize({
  maxOptions: 5,
});
// if id #addModalCounter show event
$("#addModalDivisi").on("show.bs.modal", function (e) {
  $("#divisiAdd").val("");
  setTimeout(() => {
    $("#divisiAdd").focus();
  }, 500);
});

// if id #editModalCounter show event
$("#editModalDivisi").on("show.bs.modal", function (e) {
  setTimeout(() => {
    $("#divisiEdit").focus();
  }, 500);
});

// if buttonEditModal click event get divisi with id
divisiTabel.on("click", "#buttonEditModal", function (e) {
  const id = $(this).data("id");
  console.log(id);
  $.ajax({
    url: `${ip}/atk/getDivisiById/`,
    method: "post",
    headers: { "X-CSRFToken": token },
    data: { id: id }, // Add this line to send the id in the request body
    success: (e) => {
      $('#divisiEdit').val(e.data.fields.divisi);
      selectStatusEdit[0].selectize.setValue(e.data.fields.status);
      $("#idEdit").val(e.data.pk);
    },
  });
});
// if counterAdd on enter select focus
$("#divisiAdd")
  .off("keydown")
  .on("keydown", function (e) {
    if (e.key == "Enter") {
      $("#buttonAddDivisi").click();
    }
  });
// if counterEdit on enter select focus
$("#divisiEdit")
  .off("keydown")
  .on("keydown", function (e) {
    if (e.key == "Enter") {
      $("#buttonEditDivisi").click();
    }
  });

// if id #buttonAddCounter click event
$("#buttonAddDivisi").click(function (e) {
  const divisi = $("#divisiAdd").val();
  console.log(divisi)
  $.ajax({
    url: `${ip}/atk/addDivisi/`,
    method: "post",
    data: { divisi },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      divisiTabel.ajax.reload();
      addModal.hide();
    },
    error: (e) => {
      console.log(e)
      $("#msg").append(
        `<div class="alert alert-danger">${e.responseJSON.message}!</div>`
      );
      addModal.hide();
    },
  });
});

// if id #buttonEditCounter click event
$("#buttonEditDivisi").click(function (e) {
  const divisi = $("#divisiEdit").val();
  const status = $("#statusEdit").val();
  const id = $("#idEdit").val();
  $.ajax({
    url: `${ip}/atk/editDivisi/`,
    method: "post",
    data: { divisi, status, id },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      divisiTabel.ajax.reload();
      editModal.hide();
    },
    error: (e) => {
      $("#msg").append(
        `<div class="alert alert-danger">${e.responseJSON.message}!</div>`
      );
      editModal.hide();
    },
  });
});
