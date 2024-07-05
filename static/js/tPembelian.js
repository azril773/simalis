const token = document.querySelector("[name=csrfmiddlewaretoken]").value
const modalEdit = new bootstrap.Modal("#modalEditTPembelian")
const modalAdd = new bootstrap.Modal("#modalAddTPembelian")





$("table").click(function (e) {
    if (e.target.classList.contains("editModalButton")) {
        console.log(e.target)
        const id = $(e.target).attr("data-id")
        $.ajax({
            url: `${ip}/atk/getTPembelianById/`,
            method: "post",
            data: { id },
            headers: { "X-CSRFToken": token },
            success: (e) => {
                const date = moment(e.data.fields.tgl_beli).format("YYYY-MM-DDThh:mm")
                const tgl_beli = $("#tgl_beliEdit").val(date)
                $("#idEdit").val(id)
                $("#barangEdit option").each((i, el) => {
                    if ($(el).val() == e.data.fields.master_barang_id) {
                        $(el).prop("selected", true)
                        } else {
                        $(el).prop("selected", false)
                    }
                })
                const harga = $("#hargaEdit").val(e.data.fields.harga)
                
                const qty = $("#qtyEdit").val(e.data.fields.qty)
            }
        })
    }
})


$("#editPembelian").click(function (e) {
    
})


