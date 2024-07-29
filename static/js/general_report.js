const token = document.querySelector("[name=csrfmiddlewaretoken]").value;
new DataTable("#pembelian");
new DataTable("#pengeluaran");
localStorage.removeItem("printPengeluaran");
localStorage.removeItem("printPembelian");
$("#dateRangePembelian").daterangepicker();

$("#dateRangePengeluaran").daterangepicker();

// id #itemPembelian selectize with maxOption 5
$("#itemPembelian").selectize({
  maxOptions: 5,
});

$("#itemPengeluaran").selectize({
  maxOptions: 5,
});

$("#spgAll").selectize({
  maxOptions: 5,
});

$("#searchPengeluaran").on("click", (e) => {
  $("#pengeluaran").DataTable().destroy();
  const pecah = $("#dateRangePengeluaran").val().split("-");
  const start = moment(pecah[0].trim(), "MM/DD/YYYY").format(
    "YYYY-MM-DD 00:00:00"
  );
  const end = moment(pecah[1].trim(), "MM/DD/YYYY").format(
    "YYYY-MM-DD 23:59:59"
  );
  
    $("#pengeluaranSpg").DataTable().destroy();
    setTimeout(() => {
      $("#pengeluaranSpg_wrapper").addClass("hidden");
    }, 10);
    $("#pengeluaran").removeClass("hidden");
    $("#printPdfPengeluaran").removeClass("hidden");
    $("#printPdfPengeluaranSpg").addClass("hidden");
    $("#pengeluaranSpg").addClass("hidden");
    const newTable = new DataTable("#pengeluaran", {
      ajax: {
        url: `${ip}/atk/getPengeluaranRange/`,
        method: "post",
        data: { start, end, item:"", spgAll:'' },
        headers: { "X-CSRFToken": token },
      },
      columns: [
        {
          data: "tgl_keluar",
          render: function (data, type, row, meta) {
            const split = data
              .split("T")
              .join(" ")
              .split("Z")
              .join("")
              .split(" ")
              .join(" - ");
            return `<span>${split}</span>`;
          },
        },
        {
          data: "barang",
        },
        {
          data: "harga",
          render: function (data, type, row, meta) {
            const numberFormat = parseInt(data)
              .toLocaleString("id-ID", {
                currency: "IDR",
                style: "currency",
              })
              .replace(",00", "")
              .replace("Rp", "")
              .replace(".", ".");
            return `<span class="w-full"><p class="text-end">${numberFormat}</p></span>`;
          },
        },
        {
          data: "harga_jual",
          render: function (data, type, row, meta) {
            const numberFormat = parseInt(data)
              .toLocaleString("id-ID", {
                currency: "IDR",
                style: "currency",
              })
              .replace(",00", "")
              .replace("Rp", "")
              .replace(".", ".");
            return `<span class="w-full"><p class="text-end">${numberFormat}</p></span>`;
          },
        },
        {
          data: "qty",
          render: function (data, type, row, meta) {
            const numberFormat = parseInt(data)
              .toLocaleString("id-ID", {
                currency: "IDR",
                style: "currency",
              })
              .replace(",00", "")
              .replace("Rp", "")
              .replace(".", ",");
            return `<span class="w-full"><p class="text-end">${numberFormat}</p></span>`;
          },
        },
        {
          data: "counter_bagian",
        },
        {
          data: "nama_person",
          render: function (data, type, row, meta) {
            if (data) {
              return `<span>${data}</span>`;
            } else {
              return `<span>-</span>`;
            }
          },
        },
      ],
    });
    newTable.on("xhr", function (e, type, json, xhr) {
      json.data.forEach((e) => {
        const newDate = new Date(e.tgl_keluar).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        e.tgl_keluar = moment(newDate, "DD/MM/YYYY HH.mm.SS").format(
          "YYYY-MM-DD HH:mm:ss"
        );
      });
      localStorage.setItem("printPengeluaran", JSON.stringify(json.data));
    });
});

$("#printPdfPengeluaran").on("click", function (e, i, u, d) {
  const data = localStorage.getItem("printPengeluaran");
  if (!data) return false;
  const token = document.querySelector("[name=csrfmiddlewaretoken]").value;
  $.ajax({
    url: `${ip}/atk/printPengeluaran/`,
    method: "post",
    data: { data: data },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      window.open(`${ip}/atk/printPengeluaran/`,'_blank');
    },
  });
});

$("#printPdfPengeluaranSpg").on("click", function (e, i, u, d) {
  const data = localStorage.getItem("printPengeluaran");
  if (!data) return false;
  const token = document.querySelector("[name=csrfmiddlewaretoken]").value;
  $.ajax({
    url: `${ip}/atk/printPengeluaranSpg/`,
    method: "post",
    data: { data: data },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      window.open(`${ip}/atk/printPengeluaranSpg/`,"_blank");
    },
  });
});

$("#searchPembelian").on("click", function (e) {
  const date = $("#dateRangePembelian").val().split("-");
  const token = document.querySelector("[name=csrfmiddlewaretoken]").value;
  const start = moment(date[0].trim(), "MM/DD/YYYY").format(
    "YYYY-MM-DD 00:00:00"
  );
  const end = moment(date[1].trim(), "MM/DD/YYYY").format(
    "YYYY-MM-DD 23:59:59"
  );
  const item = $("#itemPembelian").val();
  $("#pembelian").DataTable().destroy();
  const newTable = new DataTable("#pembelian", {
    ajax: {
      url: `${ip}/atk/getPembelianRange/`,
      method: "post",
      data: { start, end, item },
      headers: { "X-CSRFToken": token },
    },
    columns: [
      {
        data: "tgl_beli",
        render: (data, type, row, meta) => {
          const split = data
            .split("T")
            .join(" ")
            .split("Z")
            .join("")
            .split(" ")
            .join(" - ");
          return `<span>${split}</span>`;
        },
      },
      { data: "barang" },
      {
        data: "harga",
        render: (data, type, row, meta) => {
          const numberFormat = parseInt(data)
            .toLocaleString("id-ID", {
              currency: "IDR",
              style: "currency",
            })
            .replace(",00", "");
          return `<span class="w-full"><p class="text-end">${numberFormat}</p></span>`;
        },
      },
      {
        data: "harga_jual",
        render: (data, type, row, meta) => {
          const numberFormat = parseInt(data)
            .toLocaleString("id-ID", {
              currency: "IDR",
              style: "currency",
            })
            .replace(",00", "");
          return `<span class="w-full"><p class="text-end">${numberFormat}</p></span>`;
        },
      },
      {
        data: "qty",
        render: (data, type, row, meta) => {
          const numberFormat = parseInt(data)
            .toLocaleString("id-ID", {
              currency: "IDR",
              style: "currency",
            })
            .replace(",00", "")
            .replace("Rp", "")
            .replace(".", ".");
          return `<span class="w-full"><p class="text-end">${numberFormat}</p></span>`;
        },
      },
      {
        data: "subTotal",
        render: (data, type, row, meta) => {
          const numberFormat = parseInt(data)
            .toLocaleString("id-ID", {
              currency: "IDR",
              style: "currency",
            })
            .replace(",00", "");
          return `<span class="w-full"><p class="text-end">${numberFormat}</p></span>`;
        },
      },
    ],
    footerCallback: function (tfoot, data, start, end, display) {
      let api = this.api();
      const page = api
        .column(4, { page: "current" })
        .data()
        .reduce((a, b) => parseInt(a) + parseInt(b), 0);
      const total = api
        .column(4)
        .data()
        .reduce((a, b) => parseInt(a) + parseInt(b), 0);
      api.column(4).footer().innerHTML = `${page.toLocaleString("id-ID", {
        currency: "IDR",
        style: "currency",
      })} (${total.toLocaleString("id-ID", {
        currency: "IDR",
        style: "currency",
      })} Total)`;
      // .innerHTML = "Total"
    },
  });

  newTable.on("xhr", (data, type, json, xhr) => {
    json.data.forEach((e) => {
      const newDate = new Date(e.tgl_beli).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      e.tgl_beli = moment(newDate, "DD/MM/YYYY HH.mm.SS").format(
        "YYYY-MM-DD HH:mm:ss"
      );
    });
    localStorage.setItem("printPembelian", JSON.stringify(json));
  });
});

$("#printPdfPembelian").on("click", function (e, i, u, d) {
  const data = localStorage.getItem("printPembelian");
  if (!data) return false;
  const token = document.querySelector("[name=csrfmiddlewaretoken]").value;
  $.ajax({
    url: `${ip}/atk/printPembelian/`,
    method: "post",
    data: { data: data },
    headers: { "X-CSRFToken": token },
    success: (e) => {
      window.open(`${ip}/atk/printPembelian/`,'_blank');
    },
  });
});

const months = moment.months()
let years = moment().year()
console.log(years)
let optD = []
let i = 0
let year = 10
for (let i = 0; i < year; i++) {
    obj = {
      year:years
    }
    years -= 1
    optD.push(obj)
}
const opt = months.map(e => {
  i++
  return {
    id:i,
    month:e
  }
})
$("#bulan").selectize({
  valueField:'id',
  labelField:'month',
  options:opt
})
$("#tahun").selectize({
  valueField:'year',
  labelField:'year',
  options:optD
})


$("#printPdfLaporan").on("click",(e) => {
  const bulan = $("#bulan").val()
  const tahun = $("#tahun").val()
  $.ajax({
    url:`${ip}/atk/printPdfLaporan/`,
    method:'post',
    data:{bulan,tahun},
    headers:{"X-CSRFToken":token},
    success(e){
      window.open(`${ip}/atk/printPdfLaporan/`,"_blank")
    }
  })
})

// const item = $("#itemPengeluaran").val();
//   const spgAll = $("#spgAll").val();
//   let counter;
//   $("#spgAll option").each((i, el) => {
//     counter = $(el).html();
//   });
//   if (/(spg|spb)/gi.test(counter)) {
//     $("#pengeluaran").DataTable().destroy();
//     $("#pengeluaranSpg").DataTable().destroy();
//     setTimeout(() => {
//       $("#pengeluaran_wrapper").addClass("hidden");
//     }, 10);
//     $("#pengeluaran").addClass("hidden");
//     $("#pengeluaranSpg").removeClass("hidden");
//     $("#printPdfPengeluaran").addClass("hidden");
//     $("#printPdfPengeluaranSpg").removeClass("hidden");
//     const newTable = new DataTable("#pengeluaranSpg", {
//       ajax: {
//         url: `${ip}/atk/getPengeluaranRange/`,
//         method: "post",
//         data: { start, end, item, spgAll },
//         headers: { "X-CSRFToken": token },
//       },
//       columns: [
//         {
//           data: "tgl_keluar",
//           render: function (data, type, row, meta) {
//             const split = data
//               .split("T")
//               .join(" ")
//               .split("Z")
//               .join("")
//               .split(" ")
//               .join(" - ");
//             return `<span>${split}</span>`;
//           },
//         },
//         {
//           data: "barang",
//         },
//         {
//           data: "harga",
//           render: function (data, type, row, meta) {
//             const numberFormat = parseInt(data)
//               .toLocaleString("id-ID", {
//                 currency: "IDR",
//                 style: "currency",
//               })
//               .replace(",00", "")
//               .replace("Rp", "")
//               .replace(".", ",");
//             return `<span class="w-full"><p class="text-end">${numberFormat}</p></span>`;
//           },
//         },
//         {
//           data: "qty",
//           render: function (data, type, row, meta) {
//             const numberFormat = parseInt(data)
//               .toLocaleString("id-ID", {
//                 currency: "IDR",
//                 style: "currency",
//               })
//               .replace(",00", "")
//               .replace(".", ",");
//             return `<span class="w-full"><p class="text-end">${numberFormat}</p></span>`;
//           },
//         },
//         {
//           data: "counter_bagian",
//         },
//         {
//           data: "nama_person",
//           render: function (data, type, row, meta) {
//             if (data) {
//               return `<span>${data}</span>`;
//             } else {
//               return `<span>-</span>`;
//             }
//           },
//         },
//         {
//           data: "subTotal",
//           render: function (data, type, row, meta) {
//             const numberFormat = parseInt(data)
//               .toLocaleString("id-ID", {
//                 currency: "IDR",
//                 style: "currency",
//               })
//               .replace(",00", "")
//               .replace(".", ",");
//             return `<span class="w-full"><p class="text-end">${numberFormat}</p></span>`;
//           },
//         },
//       ],
//       footerCallback: function (tfoot, data, start, end, display) {
//         let api = this.api();
//         const page = api
//           .column(6, { page: "current" })
//           .data()
//           .reduce((a, b) => parseInt(a) + parseInt(b), 0);
//         const total = api
//           .column(6)
//           .data()
//           .reduce((a, b) => parseInt(a) + parseInt(b), 0);
//         api.column(6).footer().innerHTML = `${page.toLocaleString("id-ID", {
//           currency: "IDR",
//           style: "currency",
//         })} (${total.toLocaleString("id-ID", {
//           currency: "IDR",
//           style: "currency",
//         })} Total)`;
//         // .innerHTML = "Total"
//       },
//     });
//     newTable.on("xhr", function (e, type, json, xhr) {
//       json.data.forEach((e) => {
//         const newDate = new Date(e.tgl_keluar).toLocaleDateString("id-ID", {
//           day: "2-digit",
//           month: "2-digit",
//           year: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//           second: "2-digit",
//         });
//         e.tgl_keluar = moment(newDate, "DD/MM/YYYY HH.mm.SS").format(
//           "YYYY-MM-DD HH:mm:ss"
//         );
//       });
//       localStorage.setItem("printPengeluaran", JSON.stringify(json.data));
//     });
//   } else {