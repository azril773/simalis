"""
URL configuration for atk project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from . import views
urlpatterns = [
    path("logindispatch/",views.loginDispatch,name="dispatch"),

    path("",views.barang,name="barang"), 
    path("getBarang/",views.getBarang,name="getBarang"),
    
    path("editBarang/",views.editBarang,name="editBarang"),
    path("tambahBarang/",views.tambahBarang,name="tambahBarang"),
    path("deleteBarang/",views.deleteBarang,name="deleteBarang"),
    path("getBarangById/",views.getBarangById,name="getBarangById"),

    # PEMBELIAN
    path("getPembelian/",views.getPembelian,name="getPembelian"),
    path("pembelian/",views.pembelian,name="pembelian"),
    path("tambahPembelian/",views.tambahPembelian,name="tambahPembelian"),
    path("editPembelian/",views.editPembelian,name="editPembelian"),
    path("getPembelianById/",views.getPembelianById,name="getPembelianById"),
    path("getPembelianRange/",views.getPembelianRange,name="getPembelianRange"),

    # TEMPORARY PEMBELIAN
    path("getTPembelian/",views.getTPembelian,name="getTPembelian"),
    path("tambahTPembelian/",views.tambahTPembelian,name="tambahTPembelian"),
    path("editTPembelian/",views.editTPembelian,name="editTPembelian"),
    path("getTPembelianById/",views.getTPembelianById,name="getTPembelianById"),

    # TEMPORARY PEMBELIAN
    path("getTPengeluaran/",views.getTPengeluaran,name="getTPengeluaran"),
    path("pengeluaranT/",views.pengeluaranT,name="pengeluaranT"),  
    path("tambahTPengeluaran/",views.tambahTPengeluaran,name="tambahTPengeluaran"),
    path("editTPengeluaran/",views.editTPengeluaran,name="editTPengeluaran"),
    path("deleteTPembelian/",views.deleteTPembelian,name="deleteTPembelian"),
    path("deleteTPengeluaran/",views.deleteTPengeluaran,name="deleteTPengeluaran"),
    path("getTPengeluaranById/",views.getTPengeluaranById,name="getTPengeluaranById"),


    # POST PEMBELIAN
    path("tambahPostPembelian/",views.tambahPostPembelian,name="tambahPostPembelian"),
    path("tambahPostPengeluaran/",views.tambahPostPengeluaran,name="tambahPostPengeluaran"),

    # PENGELUARAN
    path("getPengeluaran/",views.getPengeluaran,name="getPengeluaran"),
    path("pengeluaran/",views.pengeluaran,name="pengeluaran"),
    path("tambahPengeluaran/",views.tambahPengeluaran,name="tambahPengeluaran"),
    path("editPengeluaran/",views.editPengeluaran,name="editPengeluaran"),
    path("getPengeluaranById/",views.getPengeluaranById,name="getPengeluaranById"),
    path("getPengeluaranRange/",views.getPengeluaranRange,name="getPengeluaranRange"),
    path("delPengeluaran/<int:id>",views.delPengeluaran,name="delPengeluaran"),
    # PERSON
    path("getPersonById/",views.getPersonById,name="getPersonById"),

    # LAPORAN
    path("laporan/",views.laporan,name="laporan"),
    path("rangeHarian/",views.rangeHarian,name="rangeHarian"),
    path("getLaporan/",views.getLaporan,name="getLaporan"),


    path("generalReport/",views.generalReport,name="generalReport"),


    path("printPengeluaran/",views.printPengeluaran,name="printPengeluaran"),
    path("printPengeluaranSpg/",views.printPengeluaranSpg,name="printPengeluaranSpg"),
    path("printPembelian/",views.printPembelian,name="printPembelian"),
    path("printLaporanHarian/",views.printLaporanHarian,name="printLaporanHarian"),
    path("printPdfLaporan/",views.printPdfLaporan,name="printPdfLaporan"),

    path("kategori/",views.kategori,name="kategori"),
    path("getKategori/",views.getKategori,name="getKategori"),
    path("getKategoriById/",views.getKategoriById,name="getKategoriById"),
    path("addKategori/",views.addKategori,name="addKategori"),
    path("editKategori/",views.editKategori,name="editKategori"),
    # path("deleteKategori/",views.deleteKategori,name="deleteKategori"),

    path("counter/",views.counter,name="counter"),
    path("getCounter/",views.getCounter,name="getCounter"),
    path("getCounterById/",views.getCounterById,name="getCounterById"),
    path("addCounter/",views.addCounter,name="addCounter"),
    path("editCounter/",views.editCounter,name="editCounter"),


    path("divisi/",views.divisi,name="divisi"),
    path("getDivisi/",views.getDivisi,name="getDivisi"),
    path("getDivisiById/",views.getDivisiById,name="getDivisiById"),
    path("addDivisi/",views.addDivisi,name="addDivisi"),
    path("editDivisi/",views.editDivisi,name="editDivisi"),

    path("personal/",views.personal,name="personal"),
    path("getPersonal/",views.getPersonal,name="getPersonal"),
    path("getPersonalById/",views.getPersonalById,name="getPersonalById"),
    path("addPersonal/",views.addPersonal,name="addPersonal"),
    path("editPersonal/",views.editPersonal,name="editPersonal"),

    path("logout/",views.lgtr,name="logout"),
    path("counter/",views.counter,name="counter"),


    path("loginEdit/",views.login,name="loginEdit"),
    path("editPassword/",views.editPassword,name="editPassword"),
    path("tambahUser/",views.tambahUser,name="tambahUser"),
    path("cabang/<str:cbg>",views.cabang,name="cabang"),
]
