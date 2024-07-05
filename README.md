
<h1>Project ATK Django</h1>
<p align="center">
  <a><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqwPdqgkrKMfhAhX2gEAbLFfQK1T6r94FEZw&s" width="200" alt="Nest Logo" /></a>
</p>

## Install PDFKIT and MSYQL

```bash
pip install pdfkit mysqlclient 
```

## Install wkhtmltopdf

```bahs
# ubuntu
sudo dpkg -i wkhtmltopdf.deb
```

## Configuration pdfkit with wkhtmltopdf

```bash
config = pdfkit.config(wkhtmltopdf='path/to/file/wkhtmltopdf')
file = pdfkit.from_string(file,'path/to/output.pdf',config=config)
```

