from django.contrib import admin
from django.http.request import HttpRequest
from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import *

# class Kategori(admin.ModelAdmin):
#     def has_add_permission(self, request: HttpRequest) -> bool:
#         return super().has_add_permission(request)
    
#     def has_change_permission(self, request: HttpRequest, obj: any = None) -> bool:
#         return super().has_change_permission(request, obj)

#     def has_delete_permission(self, request: HttpRequest, obj: any = None) -> bool:
#         return super().has_delete_permission(request, obj)


# class Counter_bagian(admin.ModelAdmin):
#     def has_add_permission(self, request: HttpRequest) -> bool:
#         return super().has_add_permission(request)
    
#     def has_change_permission(self, request: HttpRequest, obj: any = None) -> bool:
#         return super().has_change_permission(request, obj)

#     def has_delete_permission(self, request: HttpRequest, obj: any = None) -> bool:
#         return super().has_delete_permission(request, obj)

# class Personal(admin.ModelAdmin):
#     def has_add_permission(self, request: HttpRequest) -> bool:
#         return super().has_add_permission(request)
    
#     def has_change_permission(self, request: HttpRequest, obj: any = None) -> bool:
#         return super().has_change_permission(request, obj)

#     def has_delete_permission(self, request: HttpRequest, obj: any = None) -> bool:
#         return super().has_delete_permission(request, obj)
    
# class Stok_brg(admin.ModelAdmin):
#     def has_add_permission(self, request: HttpRequest) -> bool:
#         return super().has_add_permission(request)
    
#     def has_change_permission(self, request: HttpRequest, obj: any = None) -> bool:
#         return super().has_change_permission(request, obj)

#     def has_delete_permission(self, request: HttpRequest, obj: any = None) -> bool:
#         return super().has_delete_permission(request, obj)

@admin.register(Master_barang)
class master_barang(ImportExportModelAdmin):
    search_fields = ('barang',)
    list_display = ('barang','harga',"kategori_id")
    list_per_page = 30

@admin.register(Counter_bagian)
class counter(ImportExportModelAdmin):
    search_fields = ('counter',)
    list_display = ('counter_bagian',)
    list_per_page = 30



@admin.register(Kategori_brg)
class kategori(ImportExportModelAdmin):
    search_fields = ('kategori',)
    list_display = ('kategori',)
    list_per_page = 30



@admin.register(Personal)
class personal(ImportExportModelAdmin):
    search_fields = ('personal',)
    list_display = ('nama',"counter_bagian_id")
    list_per_page = 30


@admin.register(Stok_brg)
class stok_brg(ImportExportModelAdmin):
    search_fields = ('stok',)
    list_display = ('qty_terima',"qty_keluar","stok","kode","person","master_barang_id")
    list_per_page = 30




# admin.site.register(Kategori_brg,Kategori)
# admin.site.register(Counter_bagian,Counter_bagian)
# admin.site.register(Personal,Personal)
# admin.site.register(Stok_brg,Stok_brg) 