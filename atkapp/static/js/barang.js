const token = document.querySelector("[name=csrfmiddlewaretoken]").value
const host = "http://15.63.254.87:8000"
$("#tambahBarang").click(function(e){
    const nama_barang = $("#nama_barang").val()
    const harga_barang = $("#harga_barang").val()
    const kategori = $("#kategori").val()
    $.ajax({
        url:`${host}/atk/tambahBarang/`,
        method:"post",
        data:{nama_barang,harga_barang,kategori},
        headers:{"X-CSRFToken":token},
        success:(e) => {
            const nama_barang = $("#nama_barang").val("")
            const harga_barang = $("#harga_barang").val("")
            $("option").prop("selected",false)
        }
    })
})