// initialize id kategoriTabel with datatable
// get token
const token = document.querySelector("[name=csrfmiddlewaretoken]").value;
const addModal = new bootstrap.Modal("#addModalKategori");
const editModal = new bootstrap.Modal("#editModalKategori");
const kategoriTabel = new DataTable("#kategoriTable", {
  ajax: {
    url: `/atk/getKategori/`,
    method: "post",
    headers: { "X-CSRFToken": token },
  },
  columns: [
    { data: "fields.kategori" },
    {
      data: "fields.status",
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
        return `<button href="" class="btn btn-primary" id="buttonEditModal" data-id="${data}" data-bs-toggle="modal" data-bs-target="#editModalKategori">Edit</button>`;
      },
    },
  ],
});

const selectAddSelectize = $("#statusAdd").selectize({
  maxOptions: 5,
  onChange: changeStatusAdd,
});

const selectEditSelectize = $("#statusEdit").selectize({
  maxOptions: 5,
});
// if id #addModalKategori show event
$("#addModalKategori").on("show.bs.modal", function (e) {
  setTimeout(() => {
    $("#kategoriAdd").focus();
  }, 500);
});

// if id #editModalKategori show event
$("#editModalKategori").on("show.bs.modal", function (e) {
  setTimeout(() => {
    $("#kategoriEdit").focus();
  }, 500);
});

// if buttonEditModal click event get kategori with id
kategoriTabel.on("click", "#buttonEditModal", function (e) {
  const id = $(this).data("id");
  console.log(id);
  $.ajax({
    url: `/atk/getKategoriById/`,
    method: "post",
    headers: { "X-CSRFToken": token },
    data: { id: id }, // Add this line to send the id in the request body
    success: (e) => {
      $("#kategoriEdit").val(e.data.fields.kategori);
      selectEditSelectize[0].selectize.setValue(e.data.fields.status);
      $("#idEdit").val(e.data.pk);
    },
  });
});
// if kategoriAdd on enter select focus
$("#kategoriAdd").keydown(function (e) {
  if (e.key == "Enter") {
    selectAddSelectize[0].selectize.focus();
  }
});

// if kategoriEdit on enter select focus
$("#kategoriEdit").keydown(function (e) {
  if (e.key == "Enter") {
    selectEditSelectize[0].selectize.focus();
  }
});

function changeStatusAdd(value) {
  // tambahkategori click
  $("#buttonAddKategori").click();
}

// if id #buttonAddKategori click event
$("#buttonAddKategori").click(function (e) {
  const kategori = $("#kategoriAdd").val();
  const status = $("#statusAdd").val();
  console.log(status);
  $.ajax({
    url: `/atk/addKategori/`,
    method: "post",
    data: { kategori, status },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      kategoriTabel.ajax.reload();
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

// if id #buttonEditKategori click event
$("#buttonEditKategori").click(function (e) {
  const kategori = $("#kategoriEdit").val();
  const status = $("#statusEdit").val();
  const id = $("#idEdit").val();
  $.ajax({
    url: `/atk/editKategori/`,
    method: "post",
    data: { kategori, status, id },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      kategoriTabel.ajax.reload();
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
