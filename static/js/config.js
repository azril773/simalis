const ip = "http://15.63.254.153:5454:8000";
// "http://15.63.254.153:5454";
let hargas = "";
function formatInput(e, hrg) {
  const num = $(e.target).val(hrg.replace(/[^,\d]/g,''))
  const sisa = $(num).val().length % 3
  const awal = $(num).val().substr(0,sisa)
  const ribuan = $(num).val().substr(sisa).match(/\d{3}/g)
  let data
  const join = ribuan == undefined ? awal : (awal ? awal +'.'+ribuan.join(".") : ribuan.join("."))
  $(e.target).val(join)
}
function formatHrg(hrg) {
  const num = `${hrg}`.replace(/[^,\d]/g,'')
  const sisa = num.length % 3
  const awal = num.substr(0,sisa)
  const ribuan = num.substr(sisa).match(/\d{3}/g)
  let data
  const join = ribuan == undefined ? awal : (awal ? awal +'.'+ribuan.join(".") : ribuan.join("."))
  return join
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
