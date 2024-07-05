from django.test import TestCase,RequestFactory, TestCase,Client
from ..models import Master_barang,Kategori_brg,Pengeluaran,Counter_bagian,Personal,Stok_brg
from django.contrib.auth.models import AnonymousUser, User
from ..views import barang as pen, editBarang
import datetime
class MasterBarangTest(TestCase):
    def setUp(self):
        self.c = Client(enforce_csrf_checks=True)
        self.ktr = Kategori_brg.objects.create(kategori="atk",status="DC")
        self.brg = Master_barang.objects.create(barang="pensil",harga=1000,kategori_id=self.ktr,status="AC")
        self.ctr = Counter_bagian.objects.create(counter_bagian="silvia",status="AC")
        self.prs = Personal.objects.create(nama="silvia",status="AC",counter_bagian_id=self.ctr)
        # self.pengeluaran = Pengeluaran.objects.create(tgl_keluar=datetime.datetime.now(),qty=100,counter_id=self.ctr,master_barang_id=self.brg,personal_id=self.prs)
        # self.stok = Stok_brg.objects.create(tgl_transaksi=datetime.datetime.now(),qty_terima=0,qty_keluar=100,stok=0,kode=2,master_barang_id=self.brg)
        self.factory = RequestFactory()
        self.user = User.objects.create(username="silvi",password="silvi",email="silvi@gmail.com")

    def test_creation(self): 
        self.assertEqual(self.brg.barang,"pensil")
        self.assertEqual(self.brg.harga,1000)
        self.assertEqual(self.brg.kategori_id.pk,self.ktr.pk)
        self.assertEqual(self.brg.status,"AC")
    
    def test_updateFail(self):
        update = Master_barang.objects.get(barang="pensil")
        print(self.ktr.status)
        response = self.c.post("/atk/editBarang",data={"id":self.brg.pk,"nama_barang":self.brg.barang,"harga_barang":self.brg.harga,"kategori":self.ktr.pk},follow=True)
        self.assertEqual(response.status_code,400)

    # def test_updateSuccess(self):
    #     res = self.c.post("/atk/editBarang",data={"id":self.brg.pk,"nama_barang":self.brg.barang,"harga_barang":self.brg.harga,"kategori":self.ktr.pk},follow=True)
    #     print(self.ktr.status)
    #     print(res)
    #     self.assertEqual(res.status_code,200)

    def test_barangView(self):
        request = self.factory.get("/atk/barang")

        request.user = self.user
        response = pen(request)
        print(response)
        self.assertEqual(response.status_code,200)