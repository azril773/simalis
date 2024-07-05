from django import forms

class Barang_form(forms.Form):
    nama_barang = forms.CharField(label="Nama Barang",max_length=100, required=True)
    harga_barang = forms.IntegerField(label="Harga Barang", required=True)
    kategori = forms.IntegerField(label="Kategori", required=True)