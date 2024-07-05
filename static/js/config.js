const ip = "http://localhost:8000";
// "http://15.63.254.153:5454";
let hargas = "";
function formatInput(e, hrg = "") {
  if (/[a-z]/gi.test(e.key)) {
    hargas = hargas
    hrg = hargas
  } else if ((hrg !== "" || hrg !== "0") && !/[a-z]/gi.test(hrg)) {
    console.log("ok")
    hargas = hrg
  } else if (/\d/gi.test(e.key)) {
    hargas += e.key
  } else if (hargas) {
    hargas = hrg.split(".").join("");
  } else {
    hargas = "";
  }
  if (e.key == "Backspace") {
    if ($(e.target).val() == "") {
      hargas = ""
      return
    };
    hargas = $(e.target).val().split(".").join("");
    format(hargas, e);
    return;
  } else if (
    e.key == "Shift" ||
    e.key == "Enter" ||
    e.key == "Control" ||
    /[a-zA-Z]+/gi.test(e.key)
  ) {
    if ($(e.target).val() == "") {
      hargas = "";
      return;
    }
    hargas = "";
    // format(hargas, e);
    return;
  }
  format(hargas, e);
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
