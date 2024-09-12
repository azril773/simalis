
<h1>Project ATK Django</h1>

<p align="center">
  <a><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqwPdqgkrKMfhAhX2gEAbLFfQK1T6r94FEZw&s" width="200" alt="Nest Logo" /></a>
</p>

## Install PDFKIT, MSYQL, weasyprint

```bash
pip install pdfkit mysqlclient weasyprint
```

## Install pango library

```bash
#ubuntu

sudo apt-get install -y libpangocairo-1.0-0
```


Langkah untuk membuat permissions
  - Buat value baru didalam table content type
  - Buat data baru dengan value "cabang" untuk kolom app_label dan untuk kolom model harus sama seperti pada bagian *=cabang=*
  - Lalu buat permissions didalam table auth permissions
  - Isi kolom name sesuai dengan yang kita inginkan 
  - Lalu isi kolom content_type dengan id yang sesuai pada table content_type
  - Kemudian untuk codename disamakan seperti pada bagian *=cabang=*


### =cabang=
 - pat (Plaza Asia Tasikmalaya)
 - pas (Plaza Asia Sumedang)
 - crb (Asia Toserba Cirebon)
 - chd (Asia Toserba Cihideung)
 - grt (Asia Toserba Garut)
