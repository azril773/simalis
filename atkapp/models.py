from typing import Iterable
from django.db import models

# Create your models here.
 
class Kategori_brg(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "AC","Active"
        DEACTIVE = "DE","Deactive"
    kategori=models.CharField(max_length=150)
    status = models.CharField(max_length=2,choices=Status.choices,default=Status.ACTIVE)

class Master_barang(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "AC","Active"
        DEACTIVE = "DE","Deactive"

    barang=models.CharField(max_length=250,null=False)
    harga=models.IntegerField()
    kategori_id=models.ForeignKey(Kategori_brg,on_delete=models.PROTECT)
    status=models.CharField(max_length=2,choices=Status.choices,default=Status.DEACTIVE)

    

class Counter_bagian(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "AC","Active"
        DEACTIVE = "DE","Deactive"
    counter_bagian=models.CharField(max_length=200)
    status = models.CharField(max_length=2,choices=Status.choices,default=Status.ACTIVE)

class Personal(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "AC","Active"
        DEACTIVE = "DE","Deactive"
    nama=models.CharField(max_length=250)
    counter_bagian_id=models.ForeignKey(Counter_bagian,on_delete=models.PROTECT,null=True)
    status = models.CharField(max_length=2,choices=Status.choices,default=Status.ACTIVE)

class Pembelian(models.Model):
    tgl_beli=models.DateTimeField()
    master_barang_id=models.ForeignKey(Master_barang,on_delete=models.PROTECT)
    harga=models.IntegerField()
    subTotal=models.IntegerField()
    qty=models.IntegerField()
    
class Pengeluaran(models.Model):
    tgl_keluar=models.DateTimeField()
    master_barang_id=models.ForeignKey(Master_barang,on_delete=models.PROTECT)
    counter_id=models.ForeignKey(Counter_bagian, on_delete=models.PROTECT)
    personal_id=models.ForeignKey(Personal, on_delete=models.PROTECT,null=True)
    qty=models.IntegerField()

# KODE
# 1 = pembelian, 2 = pengeluaran, 3 = koreksi pembelian, 4 = koreksi penjualan

class Stok_brg(models.Model):
    tgl_transaksi=models.DateTimeField()
    master_barang_id=models.ForeignKey(Master_barang,on_delete=models.PROTECT)
    qty_terima=models.IntegerField()
    qty_keluar=models.IntegerField()
    stok=models.IntegerField()
    kode=models.IntegerField()
    person=models.CharField(max_length=255, null= True)
    created_at=models.DateTimeField(auto_now_add=True, null=True)

class Temporary_pembelian(models.Model):
    tgl_beli=models.DateTimeField()
    master_barang_id=models.ForeignKey(Master_barang,on_delete=models.PROTECT)
    harga=models.IntegerField()
    subTotal=models.IntegerField()
    qty=models.IntegerField()

class Temporary_pengeluaran(models.Model):
    tgl_keluar=models.DateTimeField()
    master_barang_id=models.ForeignKey(Master_barang,on_delete=models.PROTECT)
    counter_id=models.ForeignKey(Counter_bagian, on_delete=models.PROTECT)
    personal_id=models.ForeignKey(Personal, on_delete=models.PROTECT,null=True)
    qty=models.IntegerField()
