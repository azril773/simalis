// initialize id personTabel with datatable
// get token
const token = document.querySelector("[name=csrfmiddlewaretoken]").value;
const addModal = new bootstrap.Modal("#addModalPerson");
const editModal = new bootstrap.Modal("#editModalPerson");
const personTabel = new DataTable("#personTable", {
  ajax: {
    url: `${ip}/atk/getPersonal/`,
    method: "post",
    headers: { "X-CSRFToken": token },
  },
  columns: [
    { data: "personal" },
      {
          data: "counter",
        render: (data, type, row, meta) => {
            if (data !== "") {
                return `<span>${data}</span>`
            } else {
                return `<span>-</span>`
            }
        }
    },
      {
          data: "status",
          render:(data,type,row,meta) => {
            if (data == "AC") {
                return `<span class="badge bg-success">Active</span>`
            } else {
                return `<span class="badge bg-danger">Deactive</span>`
            }
        }
        
     },
    {
      data: "id",
      render: (data, type, row, meta) => {
        return `<button href="" class="btn btn-primary" id="buttonEditModal" data-id="${data}" data-bs-toggle="modal" data-bs-target="#editModalPerson">Edit</button>`;
      },
    },
  ],
});

const selectCounterEdit = $("#counterEdit").selectize({
    maxOptions: 5,
    onChange: changeCounterEdit
});
const selectCounterAdd = $("#counterAdd").selectize({
    maxOptions: 5,
    onChange: changeCounterAdd
});

const selectStatusEdit = $("#statusEdit").selectize({
    maxOptions:5
})
function changeCounterAdd(val) {
    $("#personAdd").focus()
}
function changeCounterEdit(val) {
    // selectStatusEdit[0].selectize.focus()
}

// if id #addModalPerson show event
$("#addModalPerson").on("show.bs.modal", function (e) {
  selectCounterAdd[0].selectize.clear();
  $("#personAdd").val("");
  setTimeout(() => {
    selectCounterAdd[0].selectize.focus();
  }, 500);
});

// if id #editModalPerson show event
$("#editModalPerson").on("show.bs.modal", function (e) {
  setTimeout(() => {
    $("#personEdit").focus()
  }, 500);
});



// if buttonEditModal click event get person with id
personTabel.on("click", "#buttonEditModal", function (e) {
  const id = $(this).data("id");
  console.log(id);
  $.ajax({
    url: `${ip}/atk/getPersonalById/`,
    method: "post",
    headers: { "X-CSRFToken": token },
    data: { id: id }, // Add this line to send the id in the request body
    success: (e) => {
      console.log(e);
      $("#personEdit").val(e.data.fields.nama);
        selectCounterEdit[0].selectize.setValue(e.data.fields.counter_bagian_id);
        selectStatusEdit[0].selectize.setValue(e.data.fields.status)
      $("#idEdit").val(e.data.pk);
    },
  });
});
// if personAdd on enter select focus
$("#personAdd")
  .off("keydown")
  .on("keydown", function (e) {
    if (e.key == "Enter") {
        $("#buttonAddPerson").click()
    }
  });
// if personEdit on enter select focus
$("#personEdit")
  .off("keydown")
  .on("keydown", function (e) {
    if (e.key == "Enter") {
      $("#buttonEditPerson").click()
    }
  });

// if id #buttonAddPerson click event
$("#buttonAddPerson").click(function (e) {
  const person = $("#personAdd").val();
  const counter = $("#counterAdd").val();
  $.ajax({
    url: `${ip}/atk/addPersonal/`,
    method: "post",
    data: { person, counter },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      personTabel.ajax.reload();
      addModal.hide();
    },
    error: (e) => {
      $("#msg").append(
        `<div class="alert alert-danger">${e.responseJSON.message}!</div>`
      );
      addModal.hide();
    },
  });
});

// if id #buttonEditPerson click event
$("#buttonEditPerson").click(function (e) {
  const person = $("#personEdit").val();
  const counter = $("#counterEdit").val();
    const status = $("#statusEdit").val();
    console.log(status)
  const id = $("#idEdit").val();
  $.ajax({
    url: `${ip}/atk/editPersonal/`,
    method: "post",
    data: { person, counter,status, id },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      personTabel.ajax.reload();
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
