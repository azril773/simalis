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
from django.urls import path, include
from atkapp import views
from django.contrib.auth import views as auth_views,models, authenticate,login,logout
from django.shortcuts import redirect
import os
from django.contrib import messages
def middleware(r): 
    try: 
        user = models.User.objects.using("default").get(username=r.POST.get("username"))
    except:
        messages.add_message(r,messages.ERROR,"User tidak ada")
        return redirect('/')
    # cabang = "cabang."+r.POST.get("cabang")
    permissions = models.Permission.objects.filter(content_type__app_label="cabang")
    for p in permissions:
        if user.has_perm("cabang."+p.codename):
            r.session["cabang"] = p.name
            r.session["codename"] = p.codename
            r.session["database"] = "atk_"+p.codename
            login(r,user)
            return redirect("/atk/")
    messages.add_message(r,messages.ERROR,"Anda tidak memiliki akses")
    return redirect('/')
        
urlpatterns = [
    path('admin/', admin.site.urls),
    path("",auth_views.LoginView.as_view(template_name="auth/login.html"),name="login"),
    path("login/",middleware),
    path("atk/",include("atkapp.urls"))
]