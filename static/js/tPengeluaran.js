const token = document.querySelector("[name=csrfmiddlewaretoken]").value;


const p = document.querySelector(".tableTPengeluaran");



$("#addPengeluaran").click(function (e) {
  const tgl_keluar = $("#tgl_keluarAdd").val();
  const barang = $("#barangAdd").val();
  const counter = $("#counterAdd").val();
  const person = $("#personAdd").val();
  const qty = $("#qtyAdd").val();
  if (tgl_keluar == "" || counter == "" || barang == "" || qty == "") {
    $(".msgModalTambah").html(`
              <div class="alert alert-danger" role="alert">
                  Form tidak boleh kosong!
              </div>
          `);
    return false;
  }
  $.ajax({
    url: `${ip}/atk/tambahTPengeluaran/`,
    method: "post",
    data: { tgl_keluar, counter, barang, qty, person },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      modalAdd.hide();
      table.ajax.reload();
      const tgl_beli = $("#tgl_beliAdd").val("");
      const harga = $("#hargaAdd").val("");
      $("#barangAdd option").prop("selected", false);
      const qty = $("#qtyAdd").val("");
    },
  });
});

table.on("click", ".editModalButton", function (e) {
  const id = $(e.target).attr("data-id");
});







