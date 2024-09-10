// initialize id counterTabel with datatable
// get token
const token = document.querySelector("[name=csrfmiddlewaretoken]").value;
const addModal = new bootstrap.Modal("#addModalCounter");
const editModal = new bootstrap.Modal("#editModalCounter");
const counterTabel = new DataTable("#counterTable", {
  responsive: true,
  ajax: {
    url: `/atk/getCounter/`,
    method: "post",
    headers: { "X-CSRFToken": token },
  },
  columns: [
    { data: "counter_bagian" },
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
        return `<button href="" class="btn btn-primary" id="buttonEditModal" data-id="${data}" data-bs-toggle="modal" data-bs-target="#editModalCounter">Edit</button>`;
      },
    },
  ],
});

const selectStatusEdit = $("#statusEdit").selectize({
  maxOptions: 5,
});

const divisiAddSelectize = $("#divisiAdd").selectize({
  onChange:function(e){
    $("#counterAdd").focus()
  }
})
const divisiEditSelectize = $("#divisiEdit").selectize({
  onChange:function(e){
    $("#counterEdit").focus()
  }
})
// if id #addModalCounter show event
$("#addModalCounter").on("show.bs.modal", function (e) {
  $("#counterAdd").val("");
  setTimeout(() => {
    divisiAddSelectize[0].selectize.focus();
  }, 500);
});

// if id #editModalCounter show event
$("#editModalCounter").on("show.bs.modal", function (e) {
  setTimeout(() => {
    divisiEditSelectize[0].selectize.focus();
  }, 500);
});

// if buttonEditModal click event get counter with id
counterTabel.on("click", "#buttonEditModal", function (e) {
  const id = $(this).data("id");
  console.log(id);
  $.ajax({
    url: `/atk/getCounterById/`,
    method: "post",
    headers: { "X-CSRFToken": token },
    data: { id: id }, // Add this line to send the id in the request body
    success: (e) => {
      console.log(e);
      $("#counterEdit").val(e.data.fields.counter_bagian);
      divisiEditSelectize[0].selectize.setValue(e.data.fields.divisi);
      selectStatusEdit[0].selectize.setValue(e.data.fields.status);
      $("#idEdit").val(e.data.pk);
    },
  });
});
// if counterAdd on enter select focus
$("#counterAdd")
  .off("keydown")
  .on("keydown", function (e) {
    if (e.key == "Enter") {
      $("#buttonAddCounter").click();
    }
  });
// if counterEdit on enter select focus
$("#counterEdit")
  .off("keydown")
  .on("keydown", function (e) {
    if (e.key == "Enter") {
      $("#buttonEditCounter").click();
    }
  });

// if id #buttonAddCounter click event
$("#buttonAddCounter").click(function (e) {
  const counter = $("#counterAdd").val();
  const divisi = $("#divisiAdd").val();
  $.ajax({
    url: `/atk/addCounter/`,
    method: "post",
    data: { counter,divisi },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      counterTabel.ajax.reload();
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
$("#buttonEditCounter").click(function (e) {
  const counter = $("#counterEdit").val();
  const divisi = $("#divisiEdit").val();
  const status = $("#statusEdit").val();
  const id = $("#idEdit").val();
  $.ajax({
    url: `/atk/editCounter/`,
    method: "post",
    data: { counter,divisi, status, id },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      counterTabel.ajax.reload();
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
