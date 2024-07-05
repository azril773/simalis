const token = document.querySelector("[name=csrfmiddlewaretoken]").value;
new DataTable(".tableLaporan", {
  ajax: {
    url: `${ip}/atk/getLaporan/`,
    method: "post",
    headers: { "X-CSRFToken": token },
  },
  columns: [
    {
      data: "laporan.fields.tgl_transaksi",
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
        console.log(split);
        return `<span>${split}</span>`;
      },
    },
    {
      data: "laporan.fields.qty_terima",
    },
    { data: "laporan.fields.qty_keluar" },
    { data: "laporan.fields.stok" },
    {
      data: "laporan.fields.kode",
      render: (data, type, row, meta) => {
        console.log(meta);
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
          default:
            break;
        }
      },
    },
    {
      data: "laporan.fields.person",
    },
    { data: "barang.fields.barang" },
  ],
});
