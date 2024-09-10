let hargas = "";
function formatInput(e, hrg = "") {
  const str = e.target.value.toString().replace(/[^,\d]/g, "");
    const sisa = str.length % 3;
    const rupiah = str.substr(0, sisa);
    const ribuan = str.substr(sisa).match(/\d{3}/g);
    const result = ribuan == undefined ? rupiah : (rupiah ? rupiah + "." + ribuan.join(".") : ribuan.join("."));
    console.log(result)
    return e.target.value = result;
}
function formatHrg(e, hrg = "") {
  const str = e.toString().replace(/[^,\d]/g, "");
    const sisa = str.length % 3;
    const rupiah = str.substr(0, sisa);
    const ribuan = str.substr(sisa).match(/\d{3}/g);
    const result = ribuan == undefined ? rupiah : (rupiah ? rupiah + "." + ribuan.join(".") : ribuan.join("."));
    console.log(result)
    return result;
}

function format(harga, e) {
  if (harga == "") {
    $(e.target).val(harga);
    return
  };
  const hrg = parseInt(`${harga}`.split(".").join(""));
  const format = hrg.toLocaleString("id-ID", {
    currency: "IDR",
    style: "currency",
  });
  let fors = format.replace("Rp", " ");
  fors = fors.replace(",00", "");
  $(e.target).val(fors.trim());
  return;
}