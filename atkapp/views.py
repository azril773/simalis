from django.shortcuts import render, redirect, get_object_or_404
from .models import *
from django.core.serializers import serialize # Create your views here.
from django.http import JsonResponse, HttpResponse,FileResponse
import json
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.contrib.auth.models import User
from datetime import datetime
from django.utils import timezone
from django.contrib import messages
from django.contrib.messages import get_messages
from django.db.models import Q, Sum, F
from django.template.loader import get_template 
from django.template import Context
from django.core.files.base import ContentFile
import os
from django.http import StreamingHttpResponse
from django.db import transaction,connection
import weasyprint
import calendar

bulanArr = ['Januari','Februari','Maret',"April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"]

@login_required
def loginDispatch(r):
    r.POST.get("next")

@login_required
def dashboard(r):
    return render(r,"dashboard.html") 

# BARANG
@login_required
def getBarang(r):
    data = []
    for b in Master_barang.objects.all():
        obj = {}
        k = Kategori_brg.objects.get(pk=b.kategori_id.pk)
        d = Stok_brg.objects.filter(master_barang_id=b.pk).last()
        obj["barang"] = {}
        obj["barang"]["nama_barang"] = b.barang
        obj["barang"]["harga"] = b.harga
        obj["barang"]["harga_jual"] = b.harga_jual
        obj["kategori"] = k.kategori
        obj["aksi"] = b.pk
        obj["status"] = b.status
        if not d:
            obj["stok"] = 0
            data.append(obj)
            continue
        obj["stok"] = d.stok
        
        data.append(obj)

    return JsonResponse({"data":data},status=200,safe=False)

@login_required
def barang(r):
    k = Kategori_brg.objects.all()
    return render(r,"barang/barang.html",{'kategori':k}) 

@login_required
def tambahBarang(r):
    if r.method == "POST":
        if r.POST.get("nama_barang") != "" and r.POST.get("harga_barang") != "" and r.POST.get("harga_jual") != "" and r.POST.get("kategori") != "":
            nama = r.POST.get("nama_barang")
            harga_jual = r.POST.get("harga_jual")
            kategori = r.POST.get("kategori")
            k = Kategori_brg.objects.get(pk=kategori)
            ceknama = Master_barang.objects.filter(barang=nama)
            if ceknama:
                return JsonResponse({"message":"nama barang sudah ada!"},status=400,safe=False)
            if k.status =="DC":
                return JsonResponse({"message":"kategori tidak ada!"},status=400,safe=False)
            brg = Master_barang()
            brg.barang = nama
            brg.harga = 0
            brg.harga_jual = harga_jual
            brg.kategori_id = k
            brg.save()
            return JsonResponse({"message":"success create barang"},status=200,safe=False)
    else:
        return redirect("barang")


@login_required
def editBarang(r):
    if r.POST.get("id") != "" and r.POST.get("nama_barang") != "" and r.POST.get("harga_barang") != "" and r.POST.get("harga_jual") != "" and r.POST.get("kategori") != "" :
        id = r.POST.get("id")
        kategori = r.POST.get("kategori")
        nama_barang = r.POST.get("nama_barang")
        harga_jual = r.POST.get("harga_jual")
        try:
            k = Kategori_brg.objects.get(pk=kategori,status="AC")
        except:
            return JsonResponse({"message":"Kategori sudah tidak aktif!"},status=400,safe=False)
        brg = Master_barang.objects.get(pk=id)
        brg.barang = nama_barang
        brg.harga_jual = harga_jual
        brg.kategori_id = k
        brg.save()
        msg = get_messages(r)
        arr = []
        for message in msg:
            arr.append(message.message)
        return JsonResponse({"message":"success update barang","msg":arr},status=200,safe=False)
    else:
        return redirect("barang")
        

@login_required
def deleteBarang(r):
    return render(r,"dashboard.html") 

@login_required
def getBarangById(r):
    if r.method == "POST":
        id = r.POST.get("id")
        barang = Master_barang.objects.get(pk=id)
        brg = serialize("json",[barang])
        brg = json.loads(brg)
        return JsonResponse({"data":brg[0]},status=200,safe=False)
    else:
        return redirect("barang")


# PEMBELIAN

@login_required
def getPembelian(r):
    data = []
    for p in Pembelian.objects.all():
        obj = {}
        b = Master_barang.objects.get(pk=p.master_barang_id.pk)
        k = Kategori_brg.objects.get(pk=b.kategori_id.pk)
        obj["barang"] = {}
        obj["tgl_pembelian"] = p.tgl_beli
        obj["barang"]["nama_barang"] = b.barang
        stok = Stok_brg.objects.filter(master_barang_id=b.pk).last()
        obj["kategori"] = k.kategori
        obj["aksi"] = p.pk
        obj["harga"] = p.harga
        obj["harga_jual"] = b.harga_jual
        obj["subTotal"] = int(p.harga) * int(p.qty)
        obj["qty"] = p.qty   
        obj["stok"] = stok.stok   
        data.append(obj)

    return JsonResponse({"data":data},status=200,safe=False)

@login_required
def pembelian(r):
    b = Master_barang.objects.filter(kategori_id__status="AC")
    return render(r,"pembelian/pembelian.html",{"data":b}) 

@login_required
def tambahPembelian(r):
    if r.method == "POST":
        tgl_beli = r.POST.get("tgl_beli")
        barang = r.POST.get("barang")
        harga = r.POST.get("harga")
        qty = r.POST.get("qty") 
        brg = Master_barang.objects.get(pk=barang,kategori_id__status="AC")
        if not brg:
            return 
        # if validation
        if int(brg.harga) > int(harga):
            harga = brg.harga
        
        brg.harga = harga
        subtotal = int(qty) * int(harga)
        pass
        if not brg:
            return False
        pembelian = Pembelian()
        pembelian.tgl_beli = tgl_beli
        pembelian.harga = harga
        pembelian.master_barang_id = brg
        pembelian.qty = qty
        pembelian.subTotal = subtotal
        get = Stok_brg.objects.select_for_update().filter(master_barang_id=brg.pk).last()
        s = Stok_brg()
        s.qty_terima = qty
        s.qty_keluar = 0
        if not get:
            s.stok = qty
        else:
            s.stok = int(get.stok) + int(qty)
        
        s.kode = 1
        s.person = r.user
        s.tgl_transaksi = tgl_beli
        s.master_barang_id = brg
        brg.status = "AC"
        pembelian.save()
        s.save()
        brg.save()
        return JsonResponse({"message":"success create pembelian"},status=200,safe=False)
    else:
        k = Kategori_brg.objects.filter(status="AC")
        return render(r,"barang/tambahbarang.html",{"data":k}) 
    

@login_required
def editPembelian(r):
    if r.method == "POST":
        id = r.POST.get("id")
        date = r.POST.get("date")
        brg = r.POST.get("barang")
        harga = r.POST.get("harga")
        hargaJual = r.POST.get("hargaJual")
        qty = r.POST.get("qty")
        with transaction.atomic():
            pembelian = Pembelian.objects.get(pk=id)
            b = Master_barang.objects.get(pk=brg) #pulpen
            # if validation
            b.harga = harga
            try:
                barang = Master_barang.objects.get(pk=brg,kategori_id__status="AC") #pulpen
            except:
                return JsonResponse({"message":"barang sudah tidak aktif!"},status=400,safe=False)
        
            update = int(qty) - int(pembelian.qty) # -100
            get = Stok_brg.objects.select_for_update().filter(master_barang_id=brg).last() #pulpen 100
            if int(brg) != int(pembelian.master_barang_id.pk):
                # return False
                update = qty
                qty_sebelum = pembelian.qty
                stk = Stok_brg.objects.select_for_update().filter(master_barang_id=pembelian.master_barang_id).last()
                brgSb = Master_barang.objects.get(pk=pembelian.master_barang_id.pk)
                newStok = Stok_brg()
                newStok.tgl_transaksi = datetime.now()
                newStok.qty_keluar = qty
                newStok.qty_terima = 0
                cekStok = int(stk.stok) - int(qty_sebelum)
                if cekStok < 0:
                    # newStok.stok = 0
                    # brgSb.status = "DC"
                    return JsonResponse({"message":"Stok barang tidak cukup!"},safe=False,status=400)
                elif cekStok == 0:
                    # newStok.stok = 0
                    # brgSb.status = "DC"
                    return JsonResponse({"message":"Stok barang tidak cukup!"},safe=False,status=400)
                else:
                    newStok.stok = cekStok
                newStok.kode = 4
                newStok.person = r.user
                newStok.master_barang_id = stk.master_barang_id
                newStok.save()
                brgSb.save()
                

            s = Stok_brg()
            if not get:
                updateStok = int(qty)
            else:
                updateStok = int(get.stok) + int(update)
            # jika stok habis
            # mau diisi nol atau apa pesan stok tidak ada
            if updateStok < 0:
                return JsonResponse({"message":"Stok barang tidak cukup!"},safe=False,status=400)
            
            if updateStok == 0:
                b.status = "DC"
            else:
                b.status = "AC"
            s.stok = updateStok
            s.qty_terima = qty
            s.qty_keluar = 0
            s.kode = 3
            s.person = r.user
            s.tgl_transaksi = datetime.now()
            s.master_barang_id = barang
            pembelian.tgl_beli = date
            pembelian.harga = harga
            pembelian.qty = qty
            pembelian.master_barang_id = barang
            pembelian.save()
            s.save()
            b.save()
            return JsonResponse({"message":"sdsd"},status=200)

@login_required
def getPembelianById(r):
    
    if r.method == "POST":
        id = r.POST.get("id")
        p = Pembelian.objects.get(pk=id)
        s = serialize("json",[p])
        s = json.loads(s)
        return JsonResponse({"data":s[0]},status=200,safe=False)

@login_required
def getPembelianRange(r):
    start = r.POST.get("start")
    end = r.POST.get("end")
    item = r.POST.get("item")
    if item:
        pembelian = Pembelian.objects.filter(tgl_beli__range=[start,end],master_barang_id__barang__icontains=item)
    else:
        pembelian = Pembelian.objects.filter(tgl_beli__range=[start,end])
    data = []
    for p in pembelian:
        obj = {}
        barang  = Master_barang.objects.get(pk=p.master_barang_id.pk)
        obj["tgl_beli"] = p.tgl_beli
        obj["harga"] = p.harga
        obj["qty"] = p.qty
        obj["subTotal"] = p.subTotal
        obj["barang"] = barang.barang
        obj["harga_jual"] = barang.harga_jual
        data.append(obj)   
    # pdf = open("coba.pdf")
    # response = HttpResponse(pdf.read(), content_type='application/pdf')  # Generates the response as pdf response.
    # response['Content-Disposition'] = 'attachment; filename=output.pdf'
    # pdf.close()
    # return response
    return JsonResponse({"data":data})
# PENGELUARAN  

@login_required
def getPengeluaran(r):
    data = []
    for p in Pengeluaran.objects.all():
        obj = {}
        b = Master_barang.objects.get(pk=p.master_barang_id.pk)
        k = Kategori_brg.objects.get(pk=b.kategori_id.pk)
        c = Counter_bagian.objects.get(pk=p.counter_id.pk)
        d = Divisi.objects.get(pk=p.divisi.pk)
        person = None
        obj["barang"] = {}
        obj["person"] = None
        if p.personal_id:
            person = Personal.objects.get(pk=p.personal_id.pk)
            obj["person"] = person.nama
        stok = Stok_brg.objects.filter(master_barang_id=b.pk).last()
        obj["tgl_pengeluaran"] = p.tgl_keluar
        obj["harga_jual"] = p.harga_jual
        obj["barang"]["nama_barang"] = b.barang
        obj["barang"]["harga"] = b.harga
        obj["kategori"] = k.kategori
        obj["counter"] = c.counter_bagian
        obj["divisi"] = d.divisi
        obj["qty"] = p.qty
        obj["status"] = p.status
        obj["aksi"] = p.pk

        obj["stok"] = stok.stok   
        data.append(obj) 
    return JsonResponse({"data":data},status=200,safe=False)

@login_required
def pengeluaran(r):
    barang = Master_barang.objects.filter(status="AC",kategori_id__status="AC")
    p = Personal.objects.filter(status="AC")
    c = Counter_bagian.objects.filter(status="AC")
    d = Divisi.objects.filter(status="AC")

    return render(r,"pengeluaran/pengeluaran.html",{"barang":barang,"person":p,"counter":c,'divisi':d}) 

@login_required
def tambahPengeluaran(r):
    if r.method == "POST": 
        tgl_keluar = r.POST.get("tgl_keluar")
        barang = r.POST.get("barang")
        counter = r.POST.get("counter")
        person = r.POST.get("person") 
        qty = r.POST.get("qty")
        status = r.POST.get("status")

        # get model
        with transaction.atomic():
            brg = Master_barang(pk=barang)
            ctr = Counter_bagian(pk=counter)
            prs = Personal(pk=person) 
            stk = Stok_brg.objects.select_for_update().filter(master_barang_id=barang).last()
            stok = Stok_brg()

            # update
            stok.tgl_transaksi = tgl_keluar
            stok.qty_keluar = qty
            stok.qty_terima = 0
            stok.kode = 2
            stok.person = r.user
            stok.master_barang_id = brg
            updateStok = int(stk.stok) - int(qty)

            # cek if stok < 0
            if updateStok < 0:
                return JsonResponse({"message":"Stok barang tidak cukup!"},safe=False,status=400)
            stok.stok = updateStok
            prs = None

            # cek if person is null
            if person != '':
                prs = Personal(pk=person)
            # if validation

            # update
            pengeluaran = Pengeluaran()
            pengeluaran.qty = qty
            pengeluaran.counter_id = ctr
            pengeluaran.master_barang_id = brg
            pengeluaran.personal_id = prs
            pengeluaran.tgl_keluar = tgl_keluar
            pengeluaran.status = status
            pengeluaran.save()
            stok.save()

            return JsonResponse({"message":"success create pembelian"},status=200,safe=False)
    else:
        k = Kategori_brg.objects.all()
        return render(r,"barang/tambahbarang.html",{"data":k}) 
    

@login_required
def editPengeluaran(r):
    if r.method == "POST":
        id = r.POST.get("id")
        tgl_keluar = r.POST.get("tgl_keluar")
        barang = r.POST.get("barang")
        counter = r.POST.get("counter")
        person = r.POST.get("person") 
        qty = r.POST.get("qty")
        status = r.POST.get("status")
        pengeluaran = Pengeluaran.objects.get(pk=id)
        try:
            brg = Master_barang.objects.get(pk=barang,kategori_id__status="AC")
        except:
            return JsonResponse({"message":"Barang sudah tidak aktif!"},status=400,safe=False)
        ctr = Counter_bagian.objects.get(pk=counter)
        person = Personal(pk=person)
        stk = Stok_brg.objects.filter(master_barang_id=brg).last()
        if not stk:
            return JsonResponse({"message":"Stok barang "+brg.barang+" tidak ada"},status=400)
        stok = Stok_brg()
        updateStok = int(pengeluaran.qty) - int(qty) 
        if int(pengeluaran.master_barang_id.pk) != int(barang):
            return False
            # updateStok = -abs(int(qty))
            # stks = Stok_brg.objects.filter(master_barang_id=pengeluaran.master_barang_id).last()
            # newStok = Stok_brg()
            # newStok.tgl_transaksi = datetime.now()
            # newStok.qty_keluar = 0
            # newStok.qty_terima = pengeluaran.qty
            # cekStok = int(pengeluaran.qty) + int(stks.stok)
            # newStok.stok = cekStok
            # newStok.kode = 3
            # newStok.person = r.user
            # newStok.master_barang_id = stks.master_barang_id
            


        if not person:
            person = None

        cekStok = int(stk.stok) + int(updateStok)

        if cekStok < 0:
            return JsonResponse({"message":"Stok barang "+brg.barang+" kurang dari 0"},status=400)

        if cekStok == 0:
            brg.status = "DC"
        else:
            brg.status = "AC"


        if int(pengeluaran.master_barang_id.pk) != int(barang):
            newStok.save()
        
        if int(qty) != int(pengeluaran.qty) or int(pengeluaran.master_barang_id.pk) != int(barang):    
            stok.qty_keluar = qty
            stok.qty_terima = 0
            stok.person = r.user
            stok.kode = 4
            stok.master_barang_id = brg
            stok.stok = int(stk.stok) + int(updateStok)
            stok.tgl_transaksi = datetime.now()
            stok.save() 

        if status == '1':
            if brg.harga_jual <= 0:
                if pengeluaran.harga_jual <= 0:
                    return JsonResponse({"message":"Barang ini tidak memiliki harga jual!"},status=400,safe=False)
            else:
                if pengeluaran.harga_jual <= 0:
                    pengeluaran.harga_jual = brg.harga_jual
        pengeluaran.qty = qty
        pengeluaran.tgl_keluar = tgl_keluar
        pengeluaran.master_barang_id = brg
        pengeluaran.counter_id = ctr
        pengeluaran.divisi = ctr.divisi
        pengeluaran.personal_id = person
        pengeluaran.status = status
        pengeluaran.harga_jual = pengeluaran.harga_jual
        pengeluaran.save()
        brg.save()
        return JsonResponse({"message":"sdsd"},status=200)
    else:
        k = Kategori_brg.objects.all()
        return render(r,"barang/tambahbarang.html",{"data":k}) 
    
@login_required
def getPengeluaranById(r):
    
    if r.method == "POST":
        id = r.POST.get("id")
        p = Pengeluaran.objects.get(pk=id)
        brg = Master_barang.objects.get(pk=p.master_barang_id.pk)
        s = serialize("json",[p,brg])
        s = json.loads(s)
        return JsonResponse({"data":s[0],"barang":s[1]},status=200,safe=False)
    else:
        k = Kategori_brg.objects.all()
        return render(r,"barang/tambahbarang.html",{"data":k}) 
    
@login_required
def getPengeluaranRange(r):
    start = r.POST.get("start")
    end = r.POST.get("end")
    item = r.POST.get("item")
    spgAll = r.POST.get("spgAll")
    if item:
        if spgAll:
            # printA(spgAll)
            if spgAll == "all":
                pengeluaran = Pengeluaran.objects.filter(~Q(counter_id__counter_bagian__iregex=r"spg|spg"),tgl_keluar__range=[start,end],master_barang_id__barang__icontains=item)
            else:
                pengeluaran = Pengeluaran.objects.filter(tgl_keluar__range=[start,end],master_barang_id__barang__icontains=item,counter_id__id=spgAll)
        else:
            pengeluaran = Pengeluaran.objects.filter(tgl_keluar__range=[start,end],master_barang_id__barang__icontains=item)
    else:
        if spgAll:
            if spgAll == "all":
                pengeluaran = Pengeluaran.objects.filter(~Q(counter_id__counter_bagian__iregex=r"spg|spg"),tgl_keluar__range=[start,end])
            else:
                pengeluaran = Pengeluaran.objects.filter(tgl_keluar__range=[start,end],counter_id__id=spgAll)
        else:
            pengeluaran = Pengeluaran.objects.filter(tgl_keluar__range=[start,end])
    data = []
    for p in pengeluaran:
        obj = {}
        barang  = Master_barang.objects.get(pk=p.master_barang_id.pk)
        counter  = Counter_bagian.objects.get(pk=p.counter_id.pk)
        if not p.personal_id:
            obj["nama_person"] = None
        else:
            personal  = Personal.objects.get(pk=p.personal_id.pk)
            obj["nama_person"] = personal.nama

        obj["barang"] = barang.barang
        obj["harga_jual"] = barang.harga_jual
        obj["harga"] = barang.harga
        obj["subTotal"] = int(p.qty) * int(barang.harga)
        obj["tgl_keluar"] = p.tgl_keluar
        obj["qty"] = p.qty
        obj["counter_bagian"] = counter.counter_bagian
        obj["aksi"] = p.pk
        data.append(obj)
    return JsonResponse({"data":data})
    
@login_required
def getPersonById(r):
    if r.method == 'POST':
        id = r.POST.get("id")
        p = Personal.objects.get(pk=id)
        c = Counter_bagian.objects.get(pk=p.counter_bagian_id.pk)
        s = serialize("json",[p,c])
        s = json.loads(s)
        return JsonResponse({"data":s},status=200,safe=False)
    else:
        return redirect(r,"pengeluaran")

@login_required
def laporan(r):
    return render(r,"laporan/laporan.html")

@login_required
def getLaporan(r):
    l = Stok_brg.objects.all()
    data = []
    for lp in l:
        brg = Master_barang.objects.get(pk=lp.master_barang_id.pk)
        obj = {}
        seri = serialize("json",[lp,brg])
        seri = json.loads(seri)
        obj["laporan"] = seri[0]
        obj["barang"] = seri[1]
        data.append(obj)
    return JsonResponse({"data":data},safe=False,status=200)

@login_required
def rangeHarian(r):
    if r.headers["X-Requested-With"] == "XMLHttpRequest":
        rangeHarian = r.POST.get("rangeHarian")
        date = datetime.strptime(rangeHarian,'%Y-%m-%d')
        data = Stok_brg.objects.raw("SELECT * FROM atkapp_stok_brg WHERE DAY(tgl_transaksi) = %s AND MONTH(tgl_transaksi) = %s AND YEAR(tgl_transaksi) = %s",[date.day,date.month,date.year])
        result = []
        for d in data:
            try:
                brg = Master_barang.objects.filter(pk=d.master_barang_id.pk).last()
            except:
                return JsonResponse({"data":[]},safe=False,status=200)
            
            obj = {
                'laporan':{
                    'tgl_transaksi':datetime.strftime(d.tgl_transaksi,"%Y-%m-%d %H:%M:%S"),
                    'master_barang_id':d.master_barang_id.pk,
                    'qty_terima':d.qty_terima,
                    'qty_keluar':d.qty_keluar,
                    'stok':d.stok,
                    'kode':d.kode,
                    'person':d.person,
                    'created_at':datetime.strftime(d.created_at,"%Y-%m-%d %H:%M:%S"),
                },
                'barang':{
                    'barang':brg.barang,
                    'harga':brg.harga,
                    'kategori_id':brg.kategori_id.pk,
                    'status':brg.status,
                }
            }
            result.append(obj)
        return JsonResponse({"data":result},safe=False,status=200)

@login_required
def getTPembelian(r):
    tP = Temporary_pembelian.objects.all()
    data = []
    for p in tP:
        brg = Master_barang.objects.get(pk=p.master_barang_id.pk)
        seri = serialize("json",[p,brg])
        seri = json.loads(seri)
        obj = {}
        obj["tPembelian"] = seri[0] 
        obj["barang"] = seri[1]
        obj["aksi"] = p.pk
        data.append(obj)
    
    return JsonResponse({"data":data},safe=False,status=200)

@login_required
def tambahTPembelian(r):
    if r.POST.get("tgl_beli") != "" and r.POST.get("barang") != "" and r.POST.get("harga") != "" and r.POST.get("qty") != "":
        tgl_beli = r.POST.get("tgl_beli")
        brg = r.POST.get("barang")
        harga = r.POST.get("harga")
        qty = r.POST.get("qty")
        try:
            barang = Master_barang.objects.get(pk=brg,kategori_id__status="AC")
        except:
            return JsonResponse({"message":"kategori barang sudah tidak aktif!"},status=400,safe=False)
        tp = Temporary_pembelian()
        tp.tgl_beli = tgl_beli
        tp.master_barang_id = barang
        tp.harga = harga
        tp.qty = qty
        tp.subTotal = int(qty) * int(harga)

        tp.save()
        return JsonResponse({"message":"success create temporary pembelian!"},status=200,safe=False)
    else:
        return JsonResponse({"message":"Form harus diisi!"},status=400,safe=False)

@login_required
def editTPembelian(r):
    if r.POST.get("id") != "" and r.POST.get("tgl_beli") != "" and r.POST.get("barang") != "" and r.POST.get("harga") != "" and r.POST.get("qty") != "":
        id = r.POST.get("id")
        tgl_beli = r.POST.get("tgl_beli")
        barang = r.POST.get("barang")
        harga = r.POST.get("harga")
        qty = r.POST.get("qty")
        tp = Temporary_pembelian.objects.get(pk=id)
        try:
            brg = Master_barang.objects.get(pk=barang,kategori_id__status="AC")
        except:
            return JsonResponse({"message":"barang sudah tidak aktif!"},status=400,safe=False)
        
        tp.tgl_beli = tgl_beli
        tp.harga = harga
        tp.subTotal = int(harga) * int(qty)
        tp.qty = qty
        tp.master_barang_id = brg
        tp.save()
        return JsonResponse({"message":"success edit temporary pembelian"},safe=False,status=200)

@login_required
def getTPembelianById(r):
    id = r.POST.get("id")
    tp = Temporary_pembelian.objects.get(pk=id)
    seri = serialize("json",[tp])
    seri = json.loads(seri)
    return JsonResponse({"data":seri[0]},status=200,safe=False)

@login_required
def tambahPostPembelian(r):
    id = r.POST.getlist("id[]")
    for i in id:
        tp = Temporary_pembelian.objects.get(pk=i)
        try:
            brg = Master_barang.objects.get(pk=tp.master_barang_id.pk,kategori_id__status="AC")
        except:
            messages.add_message(r,messages.ERROR," Kategori Barang "+tp.master_barang_id.barang+" sudah tidak aktif!")
            continue

        s = Stok_brg()
        if Stok_brg.objects.filter(master_barang_id__id=brg.pk).exists():
            s.kode = 1
        else:
            s.kode = 5
        if tp.harga > brg.harga:
            brg.harga = tp.harga
        brg.status = "AC"
        p = Pembelian()
        p.tgl_beli = str(tp.tgl_beli)
        p.harga = tp.harga
        p.subTotal = tp.subTotal
        p.qty = tp.qty
        p.master_barang_id = brg
        get = Stok_brg.objects.filter(master_barang_id=brg.pk).last()
        s.qty_terima = tp.qty
        s.qty_keluar = 0


        if not get:
            s.stok = tp.qty
        else:
            s.stok = int(get.stok) + int(tp.qty)

        
        s.person = r.user
        s.tgl_transaksi = tp.tgl_beli
        s.master_barang_id = brg
        s.save()
        p.save()
        brg.save()
        tp.delete()
    msg = get_messages(r)
    arr = []
    for message in msg:
        arr.append(message.message)
    if len(arr) >0 :
        return JsonResponse({"message":arr},status=400,safe=False)
    else:
        return JsonResponse({"message":"success post pembelian","msg":arr},status=200,safe=False)
        

@login_required
def pengeluaranT(r):
    brg = Master_barang.objects.all()
    person = Personal.objects.all()
    counter = Counter_bagian.objects.all()
    return render(r,"pengeluaranT/pengeluaranT.html",{"barang":brg,"person":person,"counter":counter})

@login_required
def getTPengeluaran(r):
    tP = Temporary_pengeluaran.objects.all()
    data = []
    for p in tP: 
        brg = Master_barang.objects.get(pk=p.master_barang_id.pk)
        ctr = Counter_bagian.objects.get(pk=p.counter_id.pk)
        dvs = Divisi.objects.get(pk=p.counter_id.divisi.pk)
        prs = None
        seri = None
        obj = {}
        if p.personal_id:
            prs = Personal.objects.get(pk=p.personal_id.pk)
            seri = serialize("json",[p,brg,ctr,dvs,prs])
            seri = json.loads(seri)
            obj["person"] = seri[4]
        else:
            seri = serialize("json",[p,brg,ctr,dvs])
            seri = json.loads(seri)
            obj["person"] = None
        obj["tPengeluaran"] = seri[0] 
        obj["barang"] = seri[1]
        obj["counter"] = seri[2]
        obj["divisi"] = seri[3]
        obj["aksi"] = p.pk
        data.append(obj)
    return JsonResponse({"data":data},safe=False,status=200)

@login_required
def tambahTPengeluaran(r):
    if r.POST.get("tgl_keluar") != "" and r.POST.get("counter") != "" and r.POST.get("barang") != "" and r.POST.get("qty") != "":
        tgl_keluar = r.POST.get("tgl_keluar")
        brg = r.POST.get("barang")
        counter = r.POST.get("counter")
        # divisi = r.POST.get("divisi")
        person = r.POST.get("person")
        qty = r.POST.get("qty")
        status = r.POST.get("status")
        tp = Temporary_pengeluaran()
        try:
            barang = Master_barang.objects.get(pk=brg,kategori_id__status="AC")
        except:
            return JsonResponse({"message":"Barang sudah tidak aktif!"},status=400,safe=False)
        prs = None
        stk = Stok_brg.objects.filter(master_barang_id=barang.pk).last()
        if not stk:
            return JsonResponse({"message":"Stok barang tidak ada!"},status=400,safe=False)
        elif int(stk.stok) == 0:
            return JsonResponse({"message":"Stok barang tidak cukup!"},status=400,safe=False)
        elif int(stk.stok) < int(qty):
            return JsonResponse({"message":"Stok barang tidak cukup!"},status=400,safe=False)
        if person != "":
            try:
                prs = Personal.objects.get(pk=person,status="AC")
            except:
                return JsonResponse({"message":"Person sudah tidak aktif!"},status=400,safe=False)
        tp.personal_id = prs
        try:
            c = Counter_bagian.objects.get(pk=counter,status="AC")
            d = Divisi.objects.get(pk=c.divisi.pk,status="AC")
        except:
            return JsonResponse({"message":"Counter atau divisi sudah tidak aktif!"},status=400,safe=False)

        if status == '1':
            if barang.harga_jual <= 0:
                return JsonResponse({"message":"Barang ini tidak memiliki harga jual!"},status=400,safe=False)

        tp.tgl_keluar = tgl_keluar
        tp.master_barang_id = barang
        tp.qty = qty
        tp.counter_id = c
        tp.divisi = d
        tp.status = status
        if status == "0":
            tp.harga_jual = 0
        else:
            tp.harga_jual = barang.harga_jual
        tp.save()
        return JsonResponse({"message":"success create temporary Pengeluaran!"},status=200,safe=False)
    else:
        return JsonResponse({"message":"Form harus diisi!"},status=400,safe=False)

@login_required
def editTPengeluaran(r):
    if r.POST.get("id") != "" and r.POST.get("tgl_keluar") != "" and r.POST.get("counter") != "" and r.POST.get("counter") != "" and r.POST.get("barang") != "" and r.POST.get("qty") != "":
        id = r.POST.get("id")
        tgl_keluar = r.POST.get("tgl_keluar")
        barang = r.POST.get("barang")
        counter = r.POST.get("counter")
        person = r.POST.get("person") 
        status = r.POST.get("status") 
        qty = r.POST.get("qty")
        tp = Temporary_pengeluaran.objects.get(pk=id)
        try:
            brg = Master_barang.objects.get(pk=barang,kategori_id__status="AC")
        except:
            return JsonResponse({"message":"Barang sudah tidak aktif!"},status=400,safe=False)
        try:
            ctr = Counter_bagian.objects.get(pk=counter,status="AC")
        except:
            return JsonResponse({"message":"Counter sudah tidak aktif!"},status=400,safe=False)
        prs = None
        stk = Stok_brg.objects.filter(master_barang_id=brg.pk).last()
        if not stk:
            return JsonResponse({"message":"Stok barang tidak ada!"},status=400,safe=False)
        elif int(stk.stok) == 0:
            return JsonResponse({"message":"Stok barang tidak cukup!"},status=400,safe=False)
        elif int(stk.stok) < int(qty):
            return JsonResponse({"message":"Stok barang tidak cukup!"},status=400,safe=False)
        if person != "":
            try:
                prs = Personal.objects.get(pk=person,status="AC")
            except:
                return JsonResponse({"message":"Person sudah tidak aktif!"},status=400,safe=False)
            
        if status == '1':
            if brg.harga_jual <= 0:
                return JsonResponse({"message":"Barang ini tidak memiliki harga jual!"},status=400,safe=False)

        tp.tgl_keluar = tgl_keluar
        tp.counter_id = ctr
        tp.divisi = ctr.divisi
        tp.personal_id = prs
        tp.qty = qty
        tp.master_barang_id = brg
        tp.status = status
        if status == "0":
            tp.harga_jual = 0
        else:
            tp.harga_jual = brg.harga_jual
        tp.save()
        return JsonResponse({"message":"success edit temporary Pengeluaran"},safe=False,status=200)

@login_required
def deleteTPengeluaran(r):
    if r.POST.get("id"):
        id = r.POST.get("id")
        tp = get_object_or_404(Temporary_pengeluaran,pk=id)
        tp.delete()
        return JsonResponse({"message":"success delete temporary Pengeluaran"},safe=False,status=200)

@login_required
def deleteTPembelian(r):
    if r.POST.get("id"):
        id = r.POST.get("id")
        tp = get_object_or_404(Temporary_pembelian,pk=id)
        tp.delete()
        return JsonResponse({"message":"success delete temporary Pembelian"},safe=False,status=200)



@login_required
def getTPengeluaranById(r):
    id = r.POST.get("id")
    tp = Temporary_pengeluaran.objects.get(pk=id)
    seri = serialize("json",[tp])
    seri = json.loads(seri)
    return JsonResponse({"data":seri[0]},status=200,safe=False)

@login_required
def tambahPostPengeluaran(r):
    id = r.POST.getlist("id[]")
    msg = []
    for i in id:
        tp = Temporary_pengeluaran.objects.get(pk=i)
        try:
            brg = Master_barang.objects.get(pk=tp.master_barang_id.pk,kategori_id__status="AC")
            if brg.status == "DC":
                msg.append("Barang sudah tidak aktif!")
                continue
        except:
            msg.append("Kategori sudah tidak aktif!")
            continue
        stk = Stok_brg.objects.filter(master_barang_id=brg.pk).last()
        if not stk:
            msg.append(f"Stok tidak ada untuk <b>{brg.barang}</b>!")
            continue
        elif int(stk.stok) == 0:
            msg.append(f"Stok tidak ada untuk <b>{brg.barang}</b>!")
            continue
        elif int(stk.stok) < int(tp.qty):
            msg.append(f"Stok <b>{brg.barang}</b> hanya ada <b><i>{stk.stok}</b></i>!")
            continue
        

        updateStok = int(stk.stok) - int(tp.qty)
        if updateStok <= 0:
            brg.status = "DC"
        
        prs = None
        if not tp.personal_id:
            prs = None
        else:
            try:
                prs = Personal.objects.get(pk=tp.personal_id.pk,status="AC")
            except:
                msg.append("Person sudah tidak aktif!")
                continue

        try:
            ctr = Counter_bagian.objects.get(pk=tp.counter_id.pk,status="AC")
        except:
            msg.append("Counter sudah tidak aktif!")
            continue
        p = Pengeluaran(
            tgl_keluar=tp.tgl_keluar,
            qty=tp.qty,
            counter_id=tp.counter_id,
            master_barang_id=brg,
            personal_id=prs,
            divisi_id=tp.counter_id.divisi.pk,
            status=tp.status,
            harga_jual=tp.harga_jual
        ).save()

        Stok_brg(
            kode=2,
            person=r.user,
            tgl_transaksi=tp.tgl_keluar,
            qty_keluar=tp.qty,
            master_barang_id=brg,
            stok=updateStok,
            qty_terima=0,
        ).save()


        brg.save()
        tp.delete()
    if len(msg) != 0:
        return JsonResponse({"message":msg},status=400)
    else:
        return JsonResponse({"message":"success post Pengeluaran"})

@login_required
def generalReport(r):
    # stok = []
    # s = Stok_brg.objects.all() 
    # for stk in s:
    #     obj = {}
    #     obj["stok"] = stk
    #     obj["barang"] = brg
    #     stok.append(obj)
    # pembelian = Pembelian.objects.all() 
    # pembe = []
    # for pem in pembelian:
    #     obj = {}
    #     brg = Master_barang.objects.get(pk=pem.master_barang_id.pk)
    #     obj["pembelian"] = stk
    #     obj["barang"] = brg
    #     pembe.append(obj)
    # pengeluaran = Pengeluaran.objects.all()
    # penge = []
    # for pen in pengeluaran:
    #     obj = {}
    #     brg = Master_barang.objects.get(pk=pen.master_barang_id.pk)
    #     obj["pengeluaran"] = stk
    #     obj["barang"] = brg
    #     penge.append(obj) 
        
    brg = Master_barang.objects.all()
    ctr = Counter_bagian.objects.all()
    return render(r,"generalReport/general_report.html",{"barang":brg,"counter":ctr})

# def coba(r):
    # template = get_template("pembelianLaporan.html")
    # output_text = template.render(ctx)
    # config = pdfkit.configuration(wkhtmltopdf=r"C:\wkhtmltopdf\bin\wkhtmltopdf.exe")
    # pdfkit.from_string(output_text,"atkapp/static/pdf/coba.pdf",configuration=config)

def printPengeluaran(r):
    if r.method  == "POST" :
        data = r.POST.get("data")
        body = json.loads(data)
        template = get_template("formatLaporan/pengeluaranLaporan.html")
        html = template.render({"data":body})
        file = weasyprint.HTML(string=html)
        css = weasyprint.CSS(filename=r'static/bootstrap/css/bootstrap.min.css')
        fl = file.write_pdf(r"static/pdf/pengeluaran.pdf",css=[css])
        return HttpResponse(fl)
    else:
         with open(r"static/pdf/pengeluaran.pdf","rb") as fl:
            response = HttpResponse(fl.read(),"application/pdf")
            response["Content-Disposition"] = "filename=pengeluaran"+str(datetime.now())+".pdf"
            return response
    
def printPengeluaranSpg(r):
    if r.method  == "POST" :
        data = r.POST.get("data")
        body = json.loads(data)
        total = 0
        newData= []
        for dt in body:
            obj = dt
            obj["harga"] = 'Rp. {:,}'.format(int(dt["harga"]))
            obj["qty"] = "{:,}".format(int(dt["qty"]))
            total += int(dt["subTotal"])
            obj["subTotal"] = "Rp. {:,}".format(int(dt["subTotal"]))
            newData.append(obj)
        template = get_template("formatLaporan/pengeluaranLaporanSpg.html")
        rdr = template.render({"data":body,"total":"{:,}".format(total)})
        file = weasyprint.HTML(string=rdr)
        css = weasyprint.CSS(filename=r'static/bootstrap/css/bootstrap.min.css')
        fl = file.write_pdf(r"static/pdf/pengeluaran.pdf",css=[css])
        return HttpResponse(file)
    else:
        with open(r"static/pdf/pengeluaran.pdf","rb") as fl:
            response = HttpResponse(fl.read(),"application/pdf")
            response['Content-Disposition'] = "filename=pengeluaran"+str(datetime.now())+".pdf"
            return response

def printPembelian(r):
    if r.method == "POST":
        data = r.POST.get("data")
        load = json.loads(data)
        newData= []
        total = 0
        for dt in load["data"]:
            obj = dt
            obj["harga"] = 'Rp. {:,}'.format(int(dt["harga"]))
            obj["qty"] = "{:,}".format(int(dt["qty"]))
            total += int(dt["subTotal"])
            obj["subTotal"] = "Rp. {:,}".format(int(dt["subTotal"]))
            newData.append(obj)
        template = get_template("formatLaporan/pembelianLaporan.html")
        rdr = template.render({"data":newData,"total":"{:,}".format(total)})
        file = weasyprint.HTML(string=rdr)
        css = weasyprint.CSS(filename=r'static/bootstrap/css/bootstrap.min.css')
        fl = file.write_pdf(r"static/pdf/pembelian.pdf",css=[css])
        return HttpResponse(fl)
    else:
        with open(r"static/pdf/pembelian.pdf","rb") as fl:
            response = HttpResponse(fl.read(),"application/pdf")
            response["Content-Disposition"] = "filename=pembelian"+str(datetime.now())+".pdf"
            return response

def printLaporanHarian(r):
    if r.headers["X-Requested-With"] == "XMLHttpRequest":
        data = r.POST.get("data")
        data = json.loads(data)
        for dt in data:
            obj = dt
            obj["barang"][""]

def printPdfLaporan(r):
    if r.method == "POST":
        bulan = r.POST.get("bulan") 
        tahun = r.POST.get("tahun")
        bydivisi = []
        bydivisiNon = []
        bycounter = []
        data = []
        pembelian = []
        totalPembelian = 0
        crs = connection.cursor()
        crs.execute("WITH p AS(SELECT atkapp_pembelian.subTotal,atkapp_master_barang.kategori_id_id FROM atkapp_pembelian JOIN atkapp_master_barang ON atkapp_master_barang.id = atkapp_pembelian.master_barang_id_id WHERE MONTH(atkapp_pembelian.tgl_beli) = %s AND YEAR(atkapp_pembelian.tgl_beli) = %s ) SELECT SUM(subTotal), kategori_id_id FROM p GROUP BY kategori_id_id",[bulan,tahun])
        for p in crs.fetchall():
            kategori = Kategori_brg.objects.filter(pk=p[1])
            totalPembelian += p[0]
            obj = {
                'kategori':kategori[0].kategori,
                'total':'{:,}'.format(p[0])
            }
            pembelian.append(obj)
        totalDivisi = 0
        totalDivisiNon = 0
        totalCounter = 0
        for d in Divisi.objects.all():
            bydvs = []
            bycounter = [] 
            pengeluaran = Pengeluaran.objects.raw('SELECT * FROM atkapp_pengeluaran WHERE MONTH(tgl_keluar) = %s AND YEAR(tgl_keluar) = %s AND divisi_id=%s',[bulan,tahun,d.pk])
            byr = 0
            faktur = 0
            for p in pengeluaran:
                if p.status == 1:
                    byr += p.harga_jual * p.qty
                elif p.status == 2:
                    faktur += p.master_barang_id.harga * p.qty
                else:
                    continue
            dvs = {
                'divisi':d.divisi,
                "divisi_id":d.pk,
                'tipe':[]
            }
            objbyr = {
                'tipe_pembayaran':"bayar cash",
                'total':'{:,}'.format(byr)
            }
            totalDivisi += byr

            objfaktur = {
                'tipe_pembayaran':'potong faktur',
                'total':'{:,}'.format(faktur)
            }
            totalDivisi += faktur

            dvs['tipe'].append(objbyr)
            dvs['tipe'].append(objfaktur)
            bydivisi.append(dvs)
            

            div = {
                'divisi_id':d.pk,
                'divisi':d.divisi,
                "counter":[]
            }
            for c in Counter_bagian.objects.filter(divisi_id=d.pk):
                obj = {
                    'counter':c.pk,
                    "counter_bagian":c.counter_bagian,
                }
                pengeluaran = Pengeluaran.objects.raw("SELECT master_barang_id_id,id FROM atkapp_pengeluaran WHERE MONTH(tgl_keluar) = %s AND YEAR(tgl_keluar) = %s AND counter_id_id=%s AND status=0",[bulan,tahun,c.pk])
                brg = {}
                subTotal = 0
                for p in pengeluaran:
                    try:
                        len(brg[str(p.master_barang_id_id)])
                        brgObj = {
                            'id':p.master_barang_id_id,
                            'barang':p.master_barang_id.barang,
                            'harga':p.master_barang_id.harga,
                            'qty':int(p.qty) + int(brg[str(p.master_barang_id_id)]['qty']),
                            'total':int(p.master_barang_id.harga) * int(p.qty) + int(brg[str(p.master_barang_id_id)]['total'])
                        }
                        brg[str(p.master_barang_id_id)] = brgObj
                    except:
                        brg[str(p.master_barang_id_id)] = {
                            'id':p.master_barang_id_id,
                            'barang':p.master_barang_id.barang,
                            'harga':p.master_barang_id.harga,
                            'qty':p.qty,
                            'total':int(p.master_barang_id.harga) * int(p.qty)
                        }
                    subTotal += (int(p.master_barang_id.harga) * int(p.qty))
                
                if not brg: continue
                i = 1
                brgObject = []
                for br in brg.keys():
                    newObj = brg[str(br)]
                    newObj['total'] = '{:,}'.format(newObj["total"])
                    newObj['qty'] = '{:,}'.format(newObj["qty"])
                    brgObject.append(newObj)
                obj['barang'] = brgObject
                obj['subTotal'] = '{:,}'.format(subTotal)
                div["counter"].append(obj)
            data.append(div)
        # +++++++++++++++++++++++++++++++++++++++++++ SELECT BERASARKAN STATUS 0 DAN HANYA COUNTER ++++++++++++++++++++++++++++++++++++++++++++++++
        crs.execute("WITH bayar AS(SELECT atkapp_pengeluaran.id,atkapp_pengeluaran.divisi_id,atkapp_pengeluaran.qty, atkapp_master_barang.harga FROM atkapp_pengeluaran JOIN atkapp_master_barang ON atkapp_pengeluaran.master_barang_id_id=atkapp_master_barang.id WHERE atkapp_pengeluaran.status=0 AND MONTH(atkapp_pengeluaran.tgl_keluar) = %s AND YEAR(atkapp_pengeluaran.tgl_keluar) = %s) SELECT SUM(bayar.harga * bayar.qty),bayar.divisi_id FROM bayar GROUP BY bayar.divisi_id",[bulan,tahun])
        for bc in crs.fetchall():
            try:
                divisi = Divisi.objects.filter(pk=bc[1])
                if not divisi.exists():
                    continue
                totalDivisiNon += int(bc[0])
                bydivisiNon.append({'divisi':divisi[0].divisi,'total':'{:,}'.format(bc[0])})
            except:
                continue
        
        template = get_template('formatLaporan/semuaLaporanCounter.html')
        # options = {
        #     'page-size': 'Letter',
        #     'margin-top': '0.75in',
        #     'margin-right': '0.75in',
        #     'margin-bottom': '0.75in',
        #     'margin-left': '0.75in',
        #     'encoding': "UTF-8",
        #     "enable-local-file-access": ""
        # }

        ctx = template.render({"data":data,'bulan':bulanArr[int(bulan) - 1],'tahun':tahun,'bydivisi':bydivisi,'bydivisiNon':bydivisiNon,'totalDivisiNon':'{:,}'.format(totalDivisiNon),'totalCounter':'{:,}'.format(totalCounter),'totalDivisi':'{:,}'.format(totalDivisi),'pembelian':pembelian,'totalPembelian':'{:,}'.format(totalPembelian)})
        # cfg = pdfkit.configuration(wkhtmltopdf=r'/usr/local/bin/wkhtmltopdf')
        # file = pdfkit.from_string(ctx,r'static/pdf/semuaPengeluaranCounter.pdf',configuration=cfg,options=options,css=r'static/css/laporan.css')
        file = weasyprint.HTML(string=ctx)
        css = weasyprint.CSS(filename=r'static/bootstrap/css/bootstrap.min.css')
        file.write_pdf(r'static/pdf/semuaPengeluaranCounter.pdf',stylesheets=[css])
        return JsonResponse({"data":"success"},status=200,safe=False)
    else:
        with open(r'static/pdf/semuaPengeluaranCounter.pdf','rb') as f:
            http = HttpResponse(f.read(),'application/pdf')
            http["Content-Disposition"] = 'filename=laporanCounter'+str(datetime.now())+'.pdf'
            return http    


    # <script src="{% static "js/jquery-3.7.1.js" %}"></script>
    # <script src="https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js"></script>
    # <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    # <script>
    #     $(document).ready(function(e){
    #         const {jsPDF} = window.jspdf
    #         var doc = new jsPDF('p','pt','a4');

    #         var pdfjs = document.querySelector('body');

    #         // Convert HTML to PDF in JavaScript
    #         doc.html(pdfjs, {
    #             callback: function(doc) {
    #                 doc.save("hahay.pdf")
    #             },
    #             x:10,
    #             y:10
    #         });
    #             })
    # </script
def lgtr(r):
    logout(r) 
    return redirect("login")

@login_required
def kategori(r):
    # get all kategori and return render send to template
    return render(r,"kategori/kategori.html")

# get kategori function with filter status active
@login_required
def getKategori(r):
    kategori = Kategori_brg.objects.all()
    kategori = serialize("json",kategori)
    return JsonResponse({"data":json.loads(kategori)},status=200,safe=False)

# get kategori by id
def getKategoriById(r):
    if r.method == "POST":
        id = r.POST.get("id")
        kategori = Kategori_brg.objects.get(pk=id)
        kategori = serialize("json",[kategori])
        kategori = json.loads(kategori)
        return JsonResponse({"data":kategori[0]},status=200,safe=False)


@login_required
def addKategori(r):
    # get all kategori and return render send to template
    if r.method == "POST":
        kategori = r.POST.get("kategori")
        # cek if kategori sudah ada
        cek = Kategori_brg.objects.filter(kategori=kategori)
        if cek:
            return JsonResponse({"message":"kategori sudah ada!"},status=400,safe=False)
        status = r.POST.get("status")
        k = Kategori_brg(kategori=kategori, status=status)
        k.save()
        return JsonResponse({"message":"success create kategori"},status=200,safe=False)

@login_required
def editKategori(r):
    # get all kategori and return render send to template
    if r.method == "POST":
        id = r.POST.get("id")
        kategori = r.POST.get("kategori")
        status = r.POST.get("status")
        if status == "DC":
            brg = Master_barang.objects.filter(kategori_id=id).values("id")
            arrId = [str(b["id"]) for b in brg] 
            gabung = ",".join(arrId)
            stk = Stok_brg.objects.raw("SELECT * FROM atkapp_stok_brg WHERE created_at IN(select MAX(created_at) from atkapp_stok_brg group by(master_barang_id_id)) AND master_barang_id_id IN("+gabung+")")
            for s in stk:
                if s.stok > 0:
                    return JsonResponse({"message":"Stok barang masih ada!"},status=400)
            # if not brg:
            #     return JsonResponse({"message":"Kategori masih memiliki barang!"},status=400,safe=False)
        k = Kategori_brg.objects.get(pk=id)
        k.kategori = kategori
        k.status = status
        k.save()
        return JsonResponse({"message":"success edit kategori"},status=200,safe=False)


@login_required
def personal(r):
    counter = Counter_bagian.objects.all()
    return render(r,"personal/personal.html",{
        "counter":counter
    })

@login_required
def getPersonal(r):
    personal = Personal.objects.all()
    data = []
    for p in personal:
        counter = Counter_bagian.objects.get(pk=p.counter_bagian_id.pk)
        obj = {
            "id": p.pk,
            "personal": p.nama,
            "counter" : counter.counter_bagian,
            "status" : p.status
        }
        data.append(obj)
    return JsonResponse({"data": data}, status=200, safe=False)

def getPersonalById(r):
    if r.method == "POST":
        id = r.POST.get("id")
        personal = Personal.objects.get(pk=id) 
        personal = serialize("json", [personal])
        personal = json.loads(personal)
        return JsonResponse({"data": personal[0]}, status=200, safe=False)


@login_required
def addPersonal(r):
    if r.method == "POST":
        personal = r.POST.get("person")
        counter = r.POST.get("counter")
        cek = Personal.objects.filter(nama=personal)
        if len(cek) > 0:
            return JsonResponse({"message": "personal sudah ada!"}, status=400, safe=False)
        c = Counter_bagian.objects.get(pk=counter)
        if not c:
            return JsonResponse({"message": "counter tidak ada!"}, status=400, safe=False)

        if c.status == "DC":
            return JsonResponse({"message": "Counter sudah tidak aktif!"}, status=200, safe=False)
        p = Personal()
        p.nama = personal
        p.counter_bagian_id = c
        p.save()
        return JsonResponse({"message": "success create personal"}, status=200, safe=False)

@login_required
def editPersonal(r):
    if r.method == "POST":
        id = r.POST.get("id")
        personal = r.POST.get("person")
        counter = r.POST.get("counter")
        status = r.POST.get("status")
        p = Personal.objects.get(pk=id)
        c = Counter_bagian.objects.get(pk=counter)
        if c.status == "DC":
            return JsonResponse({"message": "Counter sudah tidak aktif!"}, status=200, safe=False)
        p.nama = personal
        p.counter_bagian_id = c
        p.status = status
        p.save()
        return JsonResponse({"message": "success edit personal"}, status=200, safe=False)

@login_required
def counter(r):
    d = Divisi.objects.filter(status="AC")
    return render(r,"counter/counter.html",{'divisi':d})

@login_required
def getCounter(r):
        counter = Counter_bagian.objects.all()
        data = []
        for c in counter:
            obj = {
                'counter_bagian':c.counter_bagian,
                'status':c.status,
                'pk':c.id,
                'divisi':c.divisi.divisi
            }
            data.append(obj)
        return JsonResponse({"data":data}, status=200, safe=False)

def getCounterById(r):
    if r.method == "POST":
        id = r.POST.get("id")
        counter = Counter_bagian.objects.get(pk=id)
        counter = serialize("json", [counter])
        counter = json.loads(counter)
        return JsonResponse({"data": counter[0]}, status=200, safe=False)


@login_required
def addCounter(r):
    if r.method == "POST":
        counter = r.POST.get("counter")
        divisi = r.POST.get("divisi")
        if Counter_bagian.objects.filter(counter_bagian=counter,divisi_id=int(divisi)).exists():
            return JsonResponse({"message": "counter sudah ada!"}, status=400, safe=False)
        c = Counter_bagian(counter_bagian=counter,divisi_id=int(divisi))
        c.save()
        return JsonResponse({"message": "success create counter"}, status=200, safe=False)

@login_required
def editCounter(r):
    if r.method == "POST":
        id = r.POST.get("id")
        counter = r.POST.get("counter")
        divisi = r.POST.get("divisi")
        status = r.POST.get("status")

        if status == 'AC':
            try:
                d = Divisi.objects.get(pk=int(divisi))
                if d.status == 'DC':
                    return JsonResponse({"message": "Divisi sudah tidak aktif lagi"}, status=400, safe=False)
            except:
                return JsonResponse({"message": "success edit counter"}, status=400, safe=False)

        c = Counter_bagian.objects.get(pk=id)
        # for p in person:
        #     p.status = status
        #     p.save()
        c.counter_bagian = counter
        c.divisi_id = divisi
        c.status = status
        c.save()
        return JsonResponse({"message": "success edit counter"}, status=200, safe=False)




@login_required
def divisi(r):
    d = Divisi.objects.filter(status="AC")
    return render(r,"divisi/divisi.html",{'divisi':d})

@login_required
def getDivisi(r):
        divisi = Divisi.objects.all()
        data = []
        for d in divisi:
            obj = {
                'divisi':d.divisi,
                'status':d.status,
                'pk':d.id,
            }
            data.append(obj)
        return JsonResponse({"data":data}, status=200, safe=False)

def getDivisiById(r):
    if r.method == "POST":
        id = r.POST.get("id")
        divisi = Divisi.objects.get(pk=id)
        divisi = serialize("json", [divisi])
        divisi = json.loads(divisi)
        return JsonResponse({"data": divisi[0]}, status=200, safe=False)


@login_required
def addDivisi(r):
    if r.method == "POST":
        divisi = r.POST.get("divisi")
        if Divisi.objects.filter(divisi=divisi).exists():
            return JsonResponse({"message": "divisi sudah ada!"}, status=400, safe=False)
        d = Divisi(divisi=divisi,status="AC")
        d.save()
        return JsonResponse({"message": "success create divisi"}, status=200, safe=False)

@login_required
def editDivisi(r):
    if r.method == "POST":
        id = r.POST.get("id")
        divisi = r.POST.get("divisi")
        status = r.POST.get("status")
        if status == 'DC':
            counter = Counter_bagian.objects.filter(divisi_id=int(id))
            for c in counter:
                Personal.objects.filter(counter_bagian_id_id=c.pk).update(status="DC")
            counter.update(status="DC")
        elif status == "AC":
            counter = Counter_bagian.objects.filter(divisi_id=int(id))
            for c in counter:
                Personal.objects.filter(counter_bagian_id_id=c.pk).update(status="AC")
            counter.update(status="AC")
        d = Divisi.objects.get(pk=id)
        # for p in person:
        #     p.status = status
        #     p.save()
        d.divisi = divisi
        d.status = status
        d.save()
        return JsonResponse({"message": "success edit divisi"}, status=200, safe=False)

#     template = get_template("pembelianLaporan.html")
#     output = template.render() 
#     config = pdfkit.configuration(wkhtmltopdf=r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe")
#     pdfkit.from_string(output,"atkapp/static/pdf/coba.pdf",configuration=config)
#     pdf = open(r"C:\project\Project-Atk\atk\atkapp\static\pdf\coba.pdf","rb")
#     # response = HttpResponse(pdf.read(), content_type='application/pdf')  # Generates the response as pdf response.
#     # response["Content-Type"] = "application/force-download"
#     # response['Content-Disposition'] = 'attachment;filename=file:///C:/Project/Project-Atk/atk/atkapp/static/pdf/coba.pdf'
#     # pdf.close()
#     return FileResponse(pdf)

@login_required
def login(r):
    id = r.user.id
    return render(r,'login/login.html',{"id":id})


@login_required
def editPassword(r):
    id = r.POST.get("id")
    password = r.POST.get("password")
    get = User.objects.get(pk=id)
    get.set_password(password)
    get.save()
    return JsonResponse({'status':"ok","message":"berhasil update password"},status=201)

@login_required
def tambahUser(r):
    username = r.POST.get("username")
    email = r.POST.get("email")
    password = r.POST.get("password")
    try:
        if email == "":
            get = User.objects.create_user(username=username,password=password)
        else:
            get = User.objects.create_user(username=username,email=email,password=password)
        get.save() 
        return JsonResponse({'status':"ok","message":"berhasil menambahkan user"},status=200)
    except:
        return JsonResponse({'status':"err","message":"terjadi kesalahan"},status=400)
