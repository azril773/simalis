const token = document.querySelector("[name=csrfmiddlewaretoken]").value;
const laporanTable = new DataTable("#tableLaporan");

$("#btnFilter").on("click", function (e) {
  const rangeHarian = $("#rangeHarian").val();
  if(rangeHarian == "") return 
  $("#tableLaporan").DataTable().destroy()
  const tableD = $("#tableLaporan").DataTable({
    ajax: {
      url: `/atk/rangeHarian/`,
      method: "post",
      data:{rangeHarian},
      headers: { "X-CSRFToken": token },
    },
    columns: [
      {
        data: "laporan.tgl_transaksi",
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
        data: "laporan.qty_terima",
        render:(d,t,r,m) => {
          return formatHrg(d)
        }
      },
      { data: "laporan.qty_keluar",
        render:(d,t,r,m) => {
          return formatHrg(d)
        }
       },
      { data: "laporan.stok" ,
        render:(d,t,r,m) => {
          return formatHrg(d)
        }
      },
      {
        data: "laporan.kode",
        render: (data, type, row, meta) => {
          switch (data) {
            case 1:
              return `<span>Pembelian</span>`;
              break;
            case 2:
              return `<span>Pengeluaran</span>`;
              break;
            case 3:
              return `<span class="text-success">Koreksi Pembelian</span>`;
              break;
            case 4:
              return `<span class="text-danger">Koreksi Pengeluaran</span>`;
              break;
            case 5:
              return `<span>Stok Awal</span>`;
              break;
            default:
              break;
          }
        },
      },
      {
        data: "laporan.person",
      },
      { data: "barang.barang" },
    ],
    destroy: true,
    scrollX: "100%",
    // processing: true,
  });

  tableD.on("xhr",(data, type, json, xhr) => {
    localStorage.removeItem("laporan")
    localStorage.setItem("laporan",JSON.stringify(json.data.slice(0,)))
  })
});


$("#printPdfLaporan").on("click",(e) => {
  $.ajax({
    url:`/atk/printLaporanHarian/`,
    method:"post",
    data:{data:localStorage.getItem("laporan")},
    headers:{"X-CSRFToken":token},
    success(e){
      console.log(e)
    }
  })
})